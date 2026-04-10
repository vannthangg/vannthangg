# Auto-sync script cho Windows PowerShell
# Chay script nay de auto-push moi khi file thay doi

param(
    [string]$RepoPath = "e:\Order food"
)

Set-Location $RepoPath

Write-Host "Starting Auto-Sync Monitor..." -ForegroundColor Cyan
Write-Host "Repo: $RepoPath" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop..." -ForegroundColor Yellow

# Watch for file changes
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $RepoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Exclude folders
$ExcludeFolders = @(".git", "node_modules", "venv", "dist", "build", ".vscode")

$script:lastSync = [datetime]::MinValue
$script:debounceMs = 2000

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    
    # Skip excluded folders
    $skip = $false
    foreach ($folder in $ExcludeFolders) {
        if ($path -like "*\$folder\*") {
            $skip = $true
            break
        }
    }
    
    if ($skip) { return }
    
    # Debounce
    $now = [datetime]::Now
    if (($now - $script:lastSync).TotalMilliseconds -lt $script:debounceMs) {
        return
    }
    
    $script:lastSync = $now
    
    Write-Host ("File changed: " + $name) -ForegroundColor Green
    
    try {
        git add .
        $commitMsg = "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $commitMsg
        git push origin main
        Write-Host "Synced to GitHub" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Register-ObjectEvent -InputObject $watcher -EventName "Changed" -SourceIdentifier "FileChanged" -Action $action | Out-Null

Write-Host "Auto-sync is running..." -ForegroundColor Green

# Keep script running
while ($true) {
    Start-Sleep -Milliseconds 100
}
