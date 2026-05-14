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

$hasOrigin = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  git push -u origin main
  exit $LASTEXITCODE
}

$repoName = "dashboard"
Write-Host "Creating public repo '$repoName' and pushing..."
gh repo create $repoName --public --source=. --remote=origin --push
if ($LASTEXITCODE -ne 0) {
  Write-Host "If the name is taken, edit repoName in push-to-github.ps1 and run again."
  exit $LASTEXITCODE
}
