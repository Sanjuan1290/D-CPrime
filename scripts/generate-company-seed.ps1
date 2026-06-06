param(
  [string]$MasterWorkbook = "C:\Users\Robert\Downloads\CLIENT MASTERLIST_ SAMPLE (3) (2).xlsx",
  [string]$SoaWorkbook = "C:\Users\Robert\Downloads\SOA INSTALLMENT.xlsx",
  [string]$OutputPath = "dc_prime_company_data_seed.sql"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

function SqlString($value) {
  if ($null -eq $value) { return "NULL" }
  $text = ([string]$value).Trim()
  if ($text -eq "" -or $text -eq "System.Xml.XmlElement" -or $text -match "^#(REF|DIV/0|VALUE|N/A)!?$") { return "NULL" }
  return "'" + $text.Replace("\", "\\").Replace("'", "''") + "'"
}

function SqlNumber($value) {
  if ($null -eq $value) { return "NULL" }
  $text = ([string]$value).Trim()
  if ($text -eq "" -or $text -match "^#") { return "NULL" }
  $text = $text -replace "[,₱$ ]", ""
  $number = 0.0
  if ([double]::TryParse($text, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) {
    return ([string]::Format([Globalization.CultureInfo]::InvariantCulture, "{0:0.########}", $number))
  }
  return "NULL"
}

function SqlInt($value) {
  $number = SqlNumber $value
  if ($number -eq "NULL") { return "NULL" }
  return [string][int][double]$number
}

function SqlDate($value) {
  if ($null -eq $value) { return "NULL" }
  $text = ([string]$value).Trim()
  if ($text -eq "" -or $text -match "^#") { return "NULL" }

  $number = 0.0
  if ([double]::TryParse($text, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number) -and $number -gt 20000) {
    return "'" + ([DateTime]::FromOADate($number).ToString("yyyy-MM-dd")) + "'"
  }

  $date = [DateTime]::MinValue
  $formats = @("MM / dd / yyyy", "M / d / yyyy", "MM/dd/yyyy", "M/d/yyyy", "MM / dd / yy", "M / d / yy", "MM/dd/yy", "M/d/yy", "yyyy-MM-dd")
  if ([DateTime]::TryParseExact($text, $formats, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::None, [ref]$date)) {
    return "'" + $date.ToString("yyyy-MM-dd") + "'"
  }
  if ([DateTime]::TryParse($text, [ref]$date)) {
    return "'" + $date.ToString("yyyy-MM-dd") + "'"
  }
  return "NULL"
}

function CleanText($value) {
  if ($null -eq $value) { return $null }
  $text = ([string]$value).Trim()
  if ($text -eq "" -or $text -eq "System.Xml.XmlElement" -or $text -match "^#") { return $null }
  return ($text -replace "\s+", " ")
}

function NormalizeMode($value) {
  $text = (CleanText $value)
  if ($text -and $text.ToUpper().Contains("CASH")) { return "cash" }
  return "installment"
}

function NormalizeListingStatus($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "" }
  if ($text.Contains("reserved")) { return "reserved" }
  if ($text.Contains("sold")) { return "sold" }
  if ($text.Contains("hold")) { return "hold" }
  if ($text.Contains("inactive")) { return "inactive" }
  return "available"
}

function NormalizeLotType($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "residential" }
  if ($text.Contains("corner")) { return "corner" }
  if ($text.Contains("end")) { return "end" }
  if ($text.Contains("inner")) { return "inner" }
  return ($text -replace "[^a-z0-9]+", "_").Trim("_")
}

function NormalizePaymentStatus($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "" }
  if ($text.Contains("complete")) { return "complete_paid" }
  if ($text.Contains("partial")) { return "partially_paid" }
  return "unpaid"
}

function NormalizeAccountStatus($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "" }
  if ($text.Contains("cancel")) { return "cancelled" }
  if ($text.Contains("closed")) { return "closed" }
  return "active"
}

function NormalizeSalesStatus($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "" }
  if ($text.Contains("bad")) { return "bad_sale" }
  if ($text.Contains("cancel")) { return "cancelled" }
  return "good_sale"
}

function NormalizeDocumentStatus($value) {
  $clean = CleanText $value
  $text = if ($clean) { $clean.ToLower() } else { "" }
  if ($text.Contains("complete")) { return "complete" }
  return "incomplete"
}

function ConvertColumnRefToIndex($ref) {
  $letters = ([regex]::Match($ref, "^[A-Z]+")).Value
  $index = 0
  foreach ($ch in $letters.ToCharArray()) {
    $index = ($index * 26) + ([int][char]$ch - [int][char]'A' + 1)
  }
  return $index
}

function OpenWorkbook($path) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
  $shared = @()
  $sharedEntry = $zip.GetEntry("xl/sharedStrings.xml")
  if ($sharedEntry) {
    $reader = [IO.StreamReader]::new($sharedEntry.Open())
    [xml]$sharedXml = $reader.ReadToEnd()
    $reader.Close()
    foreach ($si in $sharedXml.sst.si) {
      $shared += (CleanText $si.InnerText)
    }
  }

  $reader = [IO.StreamReader]::new($zip.GetEntry("xl/workbook.xml").Open())
  [xml]$workbookXml = $reader.ReadToEnd()
  $reader.Close()
  $reader = [IO.StreamReader]::new($zip.GetEntry("xl/_rels/workbook.xml.rels").Open())
  [xml]$relsXml = $reader.ReadToEnd()
  $reader.Close()

  $rels = @{}
  foreach ($rel in $relsXml.Relationships.Relationship) {
    $rels[$rel.Id] = $rel.Target
  }

  $sheets = @{}
  foreach ($sheet in $workbookXml.workbook.sheets.sheet) {
    $rid = $sheet.GetAttribute("id", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
    $target = $rels[$rid]
    $pathPart = if ($target.StartsWith("/")) { $target.TrimStart("/") } else { "xl/" + $target }
    $sheets[$sheet.name] = $pathPart
  }

  return [pscustomobject]@{ Zip = $zip; Shared = $shared; Sheets = $sheets }
}

function GetSheetRows($workbook, $sheetName) {
  $path = $workbook.Sheets[$sheetName]
  if (-not $path) { return @() }
  $entry = $workbook.Zip.GetEntry($path)
  if (-not $entry) { return @() }

  $reader = [IO.StreamReader]::new($entry.Open())
  [xml]$sheetXml = $reader.ReadToEnd()
  $reader.Close()
  $rows = @()

  foreach ($row in $sheetXml.worksheet.sheetData.row) {
    $cells = @{}
    foreach ($cell in @($row.c)) {
      $index = ConvertColumnRefToIndex $cell.r
      $value = $null
      if ($cell.t -eq "s" -and $cell.v -ne $null -and [string]$cell.v -ne "") {
        $value = $workbook.Shared[[int]$cell.v]
      } elseif ($cell.t -eq "inlineStr") {
        $value = CleanText $cell.InnerText
      } else {
        $value = CleanText $cell.v
      }
      $cells[$index] = $value
    }
    $rows += [pscustomobject]@{ Row = [int]$row.r; Cells = $cells }
  }
  return $rows
}

function ConvertRowsToObjects($rows, $headerRowNumber) {
  $headerRow = $rows | Where-Object { $_.Row -eq $headerRowNumber } | Select-Object -First 1
  if (-not $headerRow) { return @() }

  $headers = @{}
  $headerCounts = @{}
  foreach ($key in $headerRow.Cells.Keys) {
    $header = CleanText $headerRow.Cells[$key]
    if ($header) {
      if ($headerCounts.ContainsKey($header)) {
        $headerCounts[$header] += 1
        $headers[$key] = "$header$($headerCounts[$header])"
      } else {
        $headerCounts[$header] = 0
        $headers[$key] = $header
      }
    }
  }

  $objects = @()
  foreach ($row in $rows | Where-Object { $_.Row -gt $headerRowNumber }) {
    $obj = [ordered]@{ _row = $row.Row }
    foreach ($key in $headers.Keys) {
      $obj[$headers[$key]] = $row.Cells[$key]
    }
    $objects += [pscustomobject]$obj
  }
  return $objects
}

function StatementForUser($name, $role, $status = "active", $email = $null, $contact = $null, $accreditationDate = $null) {
  $fullName = CleanText $name
  if (-not $fullName -or $fullName -eq "0") { return $null }
  $cleanStatus = CleanText $status
  if (-not $cleanStatus) { $cleanStatus = "active" }
  $statusValue = if ($cleanStatus.ToLower().Contains("inactive")) { "inactive" } else { "active" }
  return "INSERT INTO users (full_name, email, contact_no, role, status, accreditation_date) SELECT $(SqlString $fullName), $(SqlString $email), $(SqlString $contact), '$role', '$statusValue', $(SqlDate $accreditationDate) WHERE NOT EXISTS (SELECT 1 FROM users WHERE full_name = $(SqlString $fullName) AND role = '$role');"
}

function UserIdSubquery($name, $preferredRole) {
  $fullName = CleanText $name
  if (-not $fullName -or $fullName -eq "0") { return "NULL" }
  if ($preferredRole -eq "manager") {
    return "(SELECT id FROM users WHERE full_name = $(SqlString $fullName) ORDER BY FIELD(role, 'manager', 'agent', 'broker', 'admin', 'owner', 'treasury', 'client') LIMIT 1)"
  }
  return "(SELECT id FROM users WHERE full_name = $(SqlString $fullName) ORDER BY FIELD(role, 'agent', 'manager', 'broker', 'admin', 'owner', 'treasury', 'client') LIMIT 1)"
}

function ClientIdSubquery($buyer) {
  return "(SELECT id FROM clients WHERE buyer_name = $(SqlString $buyer) ORDER BY id LIMIT 1)"
}

function ListingIdSubquery($unitId) {
  return "(SELECT id FROM listings WHERE project_id = @project_id AND unit_id = $(SqlString $unitId) ORDER BY id LIMIT 1)"
}

function ClientUnitIdSubquery($buyer, $unitId) {
  return "(SELECT cu.id FROM client_units cu JOIN clients c ON c.id = cu.client_id JOIN listings l ON l.id = cu.listing_id WHERE c.buyer_name = $(SqlString $buyer) AND l.unit_id = $(SqlString $unitId) ORDER BY cu.id LIMIT 1)"
}

$master = OpenWorkbook $MasterWorkbook
$soa = OpenWorkbook $SoaWorkbook

try {
  $sql = New-Object System.Collections.Generic.List[string]
  $seen = New-Object System.Collections.Generic.HashSet[string]

  function AddSql($line) {
    if ($line -and $script:seen.Add($line)) {
      $script:sql.Add($line)
    }
  }

  $sql.Add("-- Generated from company Excel files. Run after dc_prime_schema.sql and dc_prime_attendance_upload_migration.sql.")
  $sql.Add("USE dc_prime;")
  $sql.Add("START TRANSACTION;")
  $sql.Add("")
  $sql.Add("INSERT INTO projects (name, location, administrator, status) SELECT 'Luntiang Aguinaldo', 'Gen. Emilio Aguinaldo, Cavite', 'D&C Prime Realty', 'active' WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Luntiang Aguinaldo');")
  $sql.Add("SET @project_id := (SELECT id FROM projects WHERE name = 'Luntiang Aguinaldo' ORDER BY id LIMIT 1);")
  $sql.Add("")

  $masterRows = ConvertRowsToObjects (GetSheetRows $master "Master List") 1
  $paymentRows = ConvertRowsToObjects (GetSheetRows $master "Payment Made Tracker") 1
  $commissionRows = ConvertRowsToObjects (GetSheetRows $master "Commission Tracker") 1
  $accreditedRows = ConvertRowsToObjects (GetSheetRows $master "Accredited Sellers") 1

  $inventoryObjects = @()
  $inventoryObjects += ConvertRowsToObjects (GetSheetRows $master "NEW LA - INVENTORY") 3
  $inventoryObjects += ConvertRowsToObjects (GetSheetRows $master "OLD LA - INVENTORY") 2

  foreach ($row in $masterRows) {
    AddSql (StatementForUser $row."Agent's Name" "agent")
    AddSql (StatementForUser $row."Unit Manager" "manager")
  }
  foreach ($row in $commissionRows) {
    AddSql (StatementForUser $row."Agent's Name" "agent")
    AddSql (StatementForUser $row."Unit Manager" "manager")
  }
  foreach ($row in $accreditedRows) {
    AddSql (StatementForUser $row."NAME OF AGENT" "agent" $row.STATUS $row.EMAIL $row."CONTACT NO." $row."ACCREDITATION DATE")
    AddSql (StatementForUser $row.MANAGER "manager")
  }

  $sql.Add("")
  $sql.Add("-- Listings from inventory sheets")
  foreach ($row in $inventoryObjects) {
    $unitId = CleanText $row."Unit ID"
    if (-not $unitId) { continue }
    $area = $row."Area (SQM)"
    if (-not $area) { $area = $row."Area (sqm)" }
    $lotTypeSource = $row."-"
    if (-not (CleanText $lotTypeSource)) { $lotTypeSource = $row.Lot }
    $lotType = NormalizeLotType $lotTypeSource
    $price = $row."Price per SQM"
    $net = $row."Net Selling Price"
    $lmfRate = SqlNumber $row.LMF
    $netNumber = SqlNumber $net
    $tcpNumber = SqlNumber $row."Total Contract Price"
    $lmfFee = "NULL"
    if ($netNumber -ne "NULL" -and $tcpNumber -ne "NULL") {
      $lmfFee = [string]::Format([Globalization.CultureInfo]::InvariantCulture, "{0:0.##}", ([double]$tcpNumber - [double]$netNumber))
    }
    $status = NormalizeListingStatus $row.Status
    AddSql "INSERT INTO listings (project_id, cadastral_lot_no, unit_id, lot_type, lot_area_sqm, price_per_sqm, net_selling_price, legal_misc_rate, legal_misc_fee, total_contract_price, status) SELECT @project_id, $(SqlString $row.'Block Location'), $(SqlString $unitId), $(SqlString $lotType), $(SqlNumber $area), $(SqlNumber $price), $(SqlNumber $net), $lmfRate, $lmfFee, $(SqlNumber $row.'Total Contract Price'), '$status' WHERE NOT EXISTS (SELECT 1 FROM listings WHERE project_id = @project_id AND unit_id = $(SqlString $unitId));"
  }

  $sql.Add("")
  $sql.Add("-- Clients and sold/client unit accounts from master list")
  foreach ($row in $masterRows) {
    $buyer = CleanText $row."Buyer's Name"
    $unitId = CleanText $row."UNIT ID"
    if (-not $buyer -or -not $unitId -or $buyer -eq "0") { continue }
    $lotType = NormalizeLotType ($row."RELOC UNIT ID")
    if (-not $lotType) { $lotType = "residential" }
    $paymentMade = SqlNumber $row."Payment Made"
    $tcp = SqlNumber $row."Total Contract Price"
    $pricePerSqm = SqlNumber $row."Price per SQM"
    $net = SqlNumber $row."Net Selling Price"
    $lmfRate = SqlNumber $row.LMF
    $lmfFee = "NULL"
    if ($net -ne "NULL" -and $tcp -ne "NULL") {
      $lmfFee = [string]::Format([Globalization.CultureInfo]::InvariantCulture, "{0:0.##}", ([double]$tcp - [double]$net))
    }

    AddSql "INSERT INTO listings (project_id, unit_id, reloc_unit_id, lot_type, lot_area_sqm, new_area_sqm, price_per_sqm, net_selling_price, legal_misc_rate, legal_misc_fee, total_contract_price, status) SELECT @project_id, $(SqlString $unitId), $(SqlString $row.'RELOC UNIT ID'), $(SqlString $lotType), $(SqlNumber $row.Area), $(SqlNumber $row.'NEW AREA'), $pricePerSqm, $net, $lmfRate, $lmfFee, $tcp, 'sold' WHERE NOT EXISTS (SELECT 1 FROM listings WHERE project_id = @project_id AND unit_id = $(SqlString $unitId));"
    AddSql "INSERT INTO clients (buyer_name, spouse_co_owner_name, aif_administrator_name, email, contact_no, age, address) SELECT $(SqlString $buyer), $(SqlString $row.'Spouse/Co-owner'), $(SqlString $row.'AIF/Administrator'), $(SqlString $row.Email), $(SqlString $row.'Contact No.'), $(SqlInt $row.AGE), $(SqlString $row.ADDRESS) WHERE NOT EXISTS (SELECT 1 FROM clients WHERE buyer_name = $(SqlString $buyer));"
    AddSql "INSERT INTO client_units (client_id, listing_id, assigned_agent_id, assigned_manager_id, reservation_date, mode_of_payment, contract_price, legal_misc_fee, total_contract_price, document_status, account_status, payment_status, sales_status, remarks) SELECT $(ClientIdSubquery $buyer), $(ListingIdSubquery $unitId), $(UserIdSubquery $row.'Agent''s Name' 'agent'), $(UserIdSubquery $row.'Unit Manager' 'manager'), $(SqlDate $row.'RESERVATION DATE'), '$(NormalizeMode $row.'Mode of Payment')', $net, $lmfFee, $tcp, '$(NormalizeDocumentStatus $row.'Document Status')', '$(NormalizeAccountStatus $row.STATUS)', '$(NormalizePaymentStatus $row.'PAYMENT STATUS')', '$(NormalizeSalesStatus $row.'SALES STATUS')', $(SqlString $row.REMARKS) WHERE $(ClientIdSubquery $buyer) IS NOT NULL AND $(ListingIdSubquery $unitId) IS NOT NULL AND NOT EXISTS (SELECT 1 FROM client_units WHERE client_id = $(ClientIdSubquery $buyer) AND listing_id = $(ListingIdSubquery $unitId));"
    if ($paymentMade -ne "NULL" -and [double]$paymentMade -gt 0) {
      $paymentType = if ($tcp -ne "NULL" -and [double]$paymentMade -ge [double]$tcp) { "full_payment" } else { "monthly" }
      AddSql "INSERT INTO payments (client_unit_id, payment_date, amount, payment_type, payment_method, status, remarks) SELECT $(ClientUnitIdSubquery $buyer $unitId), COALESCE($(SqlDate $row.'RESERVATION DATE'), CURDATE()), $paymentMade, '$paymentType', 'Imported total', 'verified', 'Imported Payment Made total from master list' WHERE $(ClientUnitIdSubquery $buyer $unitId) IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE client_unit_id = $(ClientUnitIdSubquery $buyer $unitId) AND amount = $paymentMade AND remarks = 'Imported Payment Made total from master list');"
    }
  }

  $sql.Add("")
  $sql.Add("-- Payment tracker due day updates")
  foreach ($row in $paymentRows) {
    $buyer = CleanText $row."BUYER'S NAME"
    if (-not $buyer) { $buyer = CleanText $row."Buyer's Name" }
    $unitId = CleanText $row."UNIT ID"
    $due = CleanText $row.DUE
    if (-not $buyer -or -not $unitId -or -not $due) { continue }
    $day = [regex]::Match($due, "\d+").Value
    if ($day) {
      AddSql "UPDATE client_units SET due_day = $day WHERE id = $(ClientUnitIdSubquery $buyer $unitId) AND due_day IS NULL;"
    }
  }

  $sql.Add("")
  $sql.Add("-- Commissions from commission tracker")
  foreach ($row in $commissionRows) {
    $buyer = CleanText $row."Buyer's Name"
    $unitId = CleanText $row."UNIT ID"
    if (-not $buyer -or -not $unitId -or $buyer -eq "0") { continue }
    $saleTypeText = CleanText $row."DISTRIBUTED / DIRECT"
    if (-not $saleTypeText) { $saleTypeText = "" }
    $saleType = if ($saleTypeText.ToLower().Contains("direct")) { "direct" } else { "distributed" }
    $managerName = CleanText $row."Unit Manager"
    $agentName = CleanText $row."Agent's Name"
    $managerCommission = SqlNumber $row.COMMISSION
    $managerRate = SqlNumber $row.RATE
    if ($managerName -and $managerCommission -ne "NULL" -and [double]$managerCommission -gt 0) {
      AddSql "INSERT IGNORE INTO commissions (client_unit_id, user_id, commission_type, sale_type, rate, gross_commission, status) SELECT $(ClientUnitIdSubquery $buyer $unitId), $(UserIdSubquery $managerName 'manager'), 'manager', '$saleType', $managerRate, $managerCommission, 'pending' WHERE $(ClientUnitIdSubquery $buyer $unitId) IS NOT NULL AND $(UserIdSubquery $managerName 'manager') IS NOT NULL;"
    }
    $agentRate = SqlNumber $row.RATE1
    $agentCommission = SqlNumber $row.COMMISSION1
    if ($agentName -and $agentCommission -ne "NULL" -and [double]$agentCommission -gt 0) {
      AddSql "INSERT IGNORE INTO commissions (client_unit_id, user_id, commission_type, sale_type, rate, gross_commission, status) SELECT $(ClientUnitIdSubquery $buyer $unitId), $(UserIdSubquery $agentName 'agent'), 'agent', '$saleType', $agentRate, $agentCommission, 'pending' WHERE $(ClientUnitIdSubquery $buyer $unitId) IS NOT NULL AND $(UserIdSubquery $agentName 'agent') IS NOT NULL;"
    }
  }

  $sql.Add("")
  $sql.Add("-- SOA sheets and installment schedules")
  foreach ($sheetName in $soa.Sheets.Keys) {
    if ($sheetName -in @("Master List", "Payment Made Tracker", "Payment Tracker", "Commission Tracker", "Cash Advance Tracker", "Security Bank SOA COMPANY", "SOA TP 1")) { continue }
    $rows = GetSheetRows $soa $sheetName
    if (-not $rows -or $rows.Count -eq 0) { continue }
    $buyer = $null
    $unitId = $null
    $tcp = "NULL"
    $lmf = "NULL"
    $totalPayable = "NULL"
    $area = "NULL"
    foreach ($row in $rows) {
      foreach ($idx in $row.Cells.Keys) {
        $label = CleanText $row.Cells[$idx]
        if ($label -eq "Buyer's Name") { $buyer = CleanText $row.Cells[$idx + 1] }
        if ($label -eq "Unit No.") { $unitId = CleanText $row.Cells[$idx + 1] }
        if ($label -eq "Total Contact Price" -or $label -eq "Total Contract Price") { $tcp = SqlNumber $row.Cells[$idx + 1] }
        if ($label -eq "Legal Miscellaneous Fee") { $lmf = SqlNumber $row.Cells[$idx + 1] }
        if ($label -eq "Total Amount Payable") { $totalPayable = SqlNumber $row.Cells[$idx + 1] }
        if ($label -and $label.StartsWith("Area:")) { $area = SqlNumber ($label -replace "[^0-9.]", "") }
      }
    }
    if (-not $buyer -or -not $unitId) { continue }
    AddSql "INSERT INTO clients (buyer_name) SELECT $(SqlString $buyer) WHERE NOT EXISTS (SELECT 1 FROM clients WHERE buyer_name = $(SqlString $buyer));"
    AddSql "INSERT INTO listings (project_id, unit_id, lot_area_sqm, legal_misc_fee, total_contract_price, status) SELECT @project_id, $(SqlString $unitId), $area, $lmf, COALESCE($totalPayable, $tcp), 'sold' WHERE NOT EXISTS (SELECT 1 FROM listings WHERE project_id = @project_id AND unit_id = $(SqlString $unitId));"
    AddSql "INSERT INTO client_units (client_id, listing_id, mode_of_payment, contract_price, legal_misc_fee, total_contract_price, document_status, account_status, payment_status, sales_status, remarks) SELECT $(ClientIdSubquery $buyer), $(ListingIdSubquery $unitId), 'installment', $tcp, $lmf, COALESCE($totalPayable, $tcp), 'incomplete', 'active', 'partially_paid', 'good_sale', $(SqlString ('Imported from SOA sheet: ' + $sheetName)) WHERE $(ClientIdSubquery $buyer) IS NOT NULL AND $(ListingIdSubquery $unitId) IS NOT NULL AND NOT EXISTS (SELECT 1 FROM client_units WHERE client_id = $(ClientIdSubquery $buyer) AND listing_id = $(ListingIdSubquery $unitId));"

    $header = $rows | Where-Object { $_.Cells.Values -contains "Due Date" } | Select-Object -First 1
    if (-not $header) { continue }
    $columns = @{}
    foreach ($idx in $header.Cells.Keys) {
      $headerName = CleanText $header.Cells[$idx]
      if ($headerName) {
        $columns[$headerName] = $idx
      }
    }
    if (-not $columns.ContainsKey("Due Date") -or -not $columns.ContainsKey("Description") -or -not $columns.ContainsKey("Due Amount")) {
      continue
    }
    foreach ($row in $rows | Where-Object { $_.Row -gt $header.Row }) {
      $dueDate = $row.Cells[$columns["Due Date"]]
      $description = CleanText $row.Cells[$columns["Description"]]
      $dueAmount = SqlNumber $row.Cells[$columns["Due Amount"]]
      if (-not $description -or $dueAmount -eq "NULL") { continue }
      $penalty = SqlNumber $row.Cells[$columns["Penalty"]]
      if ($penalty -eq "NULL") { $penalty = "0" }
      $datePaid = $row.Cells[$columns["Date Paid"]]
      $amountPaid = SqlNumber $row.Cells[$columns["Amount Paid"]]
      $status = "unpaid"
      if ($amountPaid -ne "NULL" -and [double]$amountPaid -gt 0) {
        $status = if ([double]$amountPaid -ge [double]$dueAmount) { "paid" } else { "partial" }
      }
      AddSql "INSERT INTO payment_schedules (client_unit_id, due_date, description, due_amount, penalty, status) SELECT $(ClientUnitIdSubquery $buyer $unitId), COALESCE($(SqlDate $dueDate), CURDATE()), $(SqlString $description), $dueAmount, $penalty, '$status' WHERE $(ClientUnitIdSubquery $buyer $unitId) IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payment_schedules WHERE client_unit_id = $(ClientUnitIdSubquery $buyer $unitId) AND description = $(SqlString $description) AND due_amount = $dueAmount);"
    }
  }

  $sql.Add("")
  $sql.Add("COMMIT;")
  $sql | Set-Content -Path $OutputPath -Encoding UTF8
  Write-Output "Generated $OutputPath with $($sql.Count) SQL lines."
}
finally {
  $master.Zip.Dispose()
  $soa.Zip.Dispose()
}
