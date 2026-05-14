# Run after one-time GitHub login. From PowerShell: .\push-to-github.ps1
$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
  [System.Environment]::GetEnvironmentVariable("Path", "User")
Set-Location $PSScriptRoot

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in. Complete browser login when prompted, then run this script again."
  gh auth login -h github.com -p https -w --skip-ssh-key
  gh auth status *> $null
  if ($LASTEXITCODE -ne 0) { exit 1 }
}

$target = "https://github.com/Yunyi1125/2026-Philips-Digital-Twin.git"
$hasOrigin = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  git push -u origin main
  exit $LASTEXITCODE
}

git remote add origin $target
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed. Ensure you are logged in (gh auth login) and have push access to Yunyi1125/2026-Philips-Digital-Twin."
  exit $LASTEXITCODE
}
