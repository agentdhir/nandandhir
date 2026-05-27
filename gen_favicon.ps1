Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(32,32)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'HighQuality'

# Navy background with rounded corners (fill full, it's 32px)
$g.Clear([System.Drawing.Color]::FromArgb(13,58,79))

# Teal V shape
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20,184,166), 3.5)
$pen.StartCap = 'Round'
$pen.EndCap = 'Round'
$pen.LineJoin = 'Round'

$p1 = New-Object System.Drawing.Point(7,6)
$p2 = New-Object System.Drawing.Point(16,26)
$p3 = New-Object System.Drawing.Point(25,6)

$g.DrawLine($pen, $p1, $p2)
$g.DrawLine($pen, $p2, $p3)

$pen.Dispose()
$g.Dispose()

$bmp.Save("c:\Users\HP\Desktop\New folder (2)\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Favicon PNG created"
