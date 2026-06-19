<#
Simple PowerShell deploy script for Netlify.
Usage examples:
  # 1) Pass token and site id as parameters
  powershell -ExecutionPolicy Bypass -File .\deploy-netlify.ps1 -NetlifyToken 'YOUR_TOKEN' -SiteId 'YOUR_SITE_ID'

  # 2) Or set environment variable and call with site id
  $env:NETLIFY_AUTH_TOKEN = 'YOUR_TOKEN'
  powershell -ExecutionPolicy Bypass -File .\deploy-netlify.ps1 -SiteId 'YOUR_SITE_ID'

This script will:
 - ensure netlify-cli is installed (using npm)
 - expand the ZIP (if present) into ./client-products-site
 - run `netlify deploy --site <siteId> --dir ./client-products-site --prod`

Note: do NOT commit or share your personal token publicly.
#>
param(
  [string]$NetlifyToken = $env:NETLIFY_AUTH_TOKEN,
  [Parameter(Mandatory=$true)][string]$SiteId,
  [string]$ZipPath = "client-products-site.zip",
  [string]$TargetDir = "client-products-site"
)

function Ensure-NetlifyCli {
  if(-not (Get-Command netlify -ErrorAction SilentlyContinue)){
    Write-Host "Netlify CLI no encontrado. Instalando netlify-cli (npm global)..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if(-not (Get-Command netlify -ErrorAction SilentlyContinue)){
      Write-Error "No se pudo instalar netlify-cli. Instala npm y ejecuta 'npm install -g netlify-cli' manualmente."; exit 1
    }
  }
}

if(-not $NetlifyToken){
  Write-Host "No se encontró NETLIFY_AUTH_TOKEN ni se pasó como parámetro." -ForegroundColor Red
  exit 1
}

# Normalizar SiteId si tiene llaves accidentalmente
$SiteId = $SiteId.Trim()
if($SiteId.StartsWith('{') -and $SiteId.EndsWith('}')){ $SiteId = $SiteId.Trim('{','}') }

Write-Host "Usando SITE_ID: $SiteId" -ForegroundColor Cyan

Ensure-NetlifyCli

# Preparar carpeta
if(Test-Path -Path $TargetDir){
  Write-Host "El directorio $TargetDir ya existe. Será sobrescrito." -ForegroundColor Yellow
  Remove-Item -Recurse -Force -Path $TargetDir
}

if(Test-Path -Path $ZipPath){
  Write-Host "Descomprimiendo $ZipPath → $TargetDir" -ForegroundColor Cyan
  Expand-Archive -Path $ZipPath -DestinationPath $TargetDir -Force
} else {
  Write-Host "$ZipPath no existe. Se asume que la carpeta $TargetDir ya está presente." -ForegroundColor Yellow
}

# Exportar token para netlify CLI
$env:NETLIFY_AUTH_TOKEN = $NetlifyToken

Write-Host "Iniciando despliegue a Netlify (modo --prod)..." -ForegroundColor Cyan

try{
  & netlify deploy --site $SiteId --dir .\$TargetDir --prod 2>&1 | Tee-Object -Variable output
  $last = $output[-1]
  Write-Host "Despliegue finalizado. Última línea del log:" -ForegroundColor Green
  Write-Host $last
} catch {
  Write-Error "Error ejecutando netlify deploy: $_"
  exit 1
}

Write-Host "Si necesitas revisar logs completos, pega la salida aquí y te ayudo a interpretar errores." -ForegroundColor Cyan
