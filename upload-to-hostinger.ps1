# PowerShell Script to Upload to Hostinger via FTP
# This script uploads all files from the 'out' folder to your Hostinger hosting

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hostinger Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$LocalFolder = ".\out"
$FtpServer = Read-Host "Enter FTP Server (e.g., ftp.learnandgrow.io)"
$FtpUsername = Read-Host "Enter FTP Username"
$FtpPassword = Read-Host "Enter FTP Password" -AsSecureString
$RemoteFolder = "/public_html"

# Convert secure string to plain text (needed for FTP)
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($FtpPassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Local Folder: $LocalFolder" -ForegroundColor Gray
Write-Host "  FTP Server: $FtpServer" -ForegroundColor Gray
Write-Host "  Username: $FtpUsername" -ForegroundColor Gray
Write-Host "  Remote Folder: $RemoteFolder" -ForegroundColor Gray
Write-Host ""

# Function to upload file via FTP
function Upload-FileToFtp {
    param (
        [string]$LocalPath,
        [string]$RemotePath,
        [string]$Server,
        [string]$Username,
        [string]$Password
    )
    
    try {
        $FtpUri = "ftp://$Server$RemotePath"
        $FtpRequest = [System.Net.FtpWebRequest]::Create($FtpUri)
        $FtpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $FtpRequest.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
        $FtpRequest.UseBinary = $true
        $FtpRequest.KeepAlive = $false
        
        # Read file content
        $FileContent = [System.IO.File]::ReadAllBytes($LocalPath)
        $FtpRequest.ContentLength = $FileContent.Length
        
        # Upload file
        $RequestStream = $FtpRequest.GetRequestStream()
        $RequestStream.Write($FileContent, 0, $FileContent.Length)
        $RequestStream.Close()
        
        # Get response
        $Response = $FtpRequest.GetResponse()
        $Response.Close()
        
        return $true
    }
    catch {
        Write-Host "  Error uploading: $_" -ForegroundColor Red
        return $false
    }
}

# Function to create directory via FTP
function Create-FtpDirectory {
    param (
        [string]$RemotePath,
        [string]$Server,
        [string]$Username,
        [string]$Password
    )
    
    try {
        $FtpUri = "ftp://$Server$RemotePath"
        $FtpRequest = [System.Net.FtpWebRequest]::Create($FtpUri)
        $FtpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $FtpRequest.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
        
        $Response = $FtpRequest.GetResponse()
        $Response.Close()
        return $true
    }
    catch {
        # Directory might already exist, which is fine
        return $true
    }
}

# Main upload process
Write-Host "Starting upload process..." -ForegroundColor Green
Write-Host ""

$UploadedCount = 0
$FailedCount = 0

# Get all files recursively
$AllFiles = Get-ChildItem -Path $LocalFolder -Recurse -File

foreach ($File in $AllFiles) {
    # Calculate relative path
    $RelativePath = $File.FullName.Substring($LocalFolder.Length)
    $RelativePath = $RelativePath.Replace("\", "/")
    $RemotePath = "$RemoteFolder$RelativePath"
    
    # Get directory path
    $RemoteDir = Split-Path $RemotePath -Parent
    
    # Create directory if needed (silently)
    if ($RemoteDir) {
        Create-FtpDirectory -RemotePath $RemoteDir -Server $FtpServer -Username $FtpUsername -Password $PlainPassword | Out-Null
    }
    
    # Upload file
    Write-Host "Uploading: $RelativePath" -ForegroundColor Cyan
    $Success = Upload-FileToFtp -LocalPath $File.FullName -RemotePath $RemotePath -Server $FtpServer -Username $FtpUsername -Password $PlainPassword
    
    if ($Success) {
        Write-Host "  ✓ Success" -ForegroundColor Green
        $UploadedCount++
    }
    else {
        Write-Host "  ✗ Failed" -ForegroundColor Red
        $FailedCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Uploaded: $UploadedCount files" -ForegroundColor Green
Write-Host "  Failed: $FailedCount files" -ForegroundColor $(if ($FailedCount -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "Your website should now be live at:" -ForegroundColor Yellow
Write-Host "  https://learnandgrow.io" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Enable SSL in Hostinger dashboard" -ForegroundColor Gray
Write-Host "  2. Wait 5-15 minutes for SSL to activate" -ForegroundColor Gray
Write-Host "  3. Visit your website!" -ForegroundColor Gray
Write-Host ""
