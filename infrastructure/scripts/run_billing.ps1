# PlanLedger Manual Billing Execution Script (PowerShell)
param (
    [string]$TargetDate = "",
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\..\.."
$ApiDir = "$ProjectRoot\apps\api"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " PlanLedger Billing Engine Manual Invocation" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location $ApiDir

$CmdArgs = @("manage.py", "run_billing")

if ($TargetDate -ne "") {
    Write-Host "[Billing] Target Date: $TargetDate" -ForegroundColor Yellow
    $CmdArgs += "--date=$TargetDate"
} else {
    Write-Host "[Billing] Target Date: Today" -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host "[Billing] Mode: DRY RUN (no database changes)" -ForegroundColor Magenta
    $CmdArgs += "--dry-run"
} else {
    Write-Host "[Billing] Mode: LIVE EXECUTION" -ForegroundColor Green
}

python @CmdArgs
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Billing execution completed." -ForegroundColor Cyan
