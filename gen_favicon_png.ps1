# Generate multiple PNG favicon sizes for maximum browser compatibility
Add-Type -AssemblyName System.Drawing

function Make-Favicon {
    param([int]$size, [string]$filename)
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'HighQuality'
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.CompositingQuality = 'HighQuality'
    
    # Scale factor
    $s = $size / 64.0
    
    # Background gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($size, $size)),
        [System.Drawing.Color]::FromArgb(255, 13, 58, 79),
        [System.Drawing.Color]::FromArgb(255, 5, 30, 44)
    )
    
    # Rounded rectangle
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = [int]($s * 14)
    if ($r -lt 2) { $r = 2 }
    $path.AddArc(0, 0, $r*2, $r*2, 180, 90)
    $path.AddArc($size-$r*2, 0, $r*2, $r*2, 270, 90)
    $path.AddArc($size-$r*2, $size-$r*2, $r*2, $r*2, 0, 90)
    $path.AddArc(0, $size-$r*2, $r*2, $r*2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)
    
    # V shape with teal color
    $penWidth = [float]($s * 6.5)
    if ($penWidth -lt 2) { $penWidth = 2 }
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 20, 184, 166), $penWidth)
    $pen.StartCap = 'Round'
    $pen.EndCap = 'Round'
    $pen.LineJoin = 'Round'
    
    $x1 = [float]($s * 18)
    $y1 = [float]($s * 16)
    $x2 = [float]($s * 32)
    $y2 = [float]($s * 48)
    $x3 = [float]($s * 46)
    $y3 = [float]($s * 16)
    
    $g.DrawLine($pen, $x1, $y1, $x2, $y2)
    $g.DrawLine($pen, $x2, $y2, $x3, $y3)
    
    # Small accent dot
    $dotR = [float]($s * 2.5)
    $dotX = [float]($s * 32 - $dotR)
    $dotY = [float]($s * 52 - $dotR)
    $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 20, 184, 166))
    $g.FillEllipse($dotBrush, $dotX, $dotY, $dotR*2, $dotR*2)
    
    $g.Dispose()
    $bmp.Save("$PSScriptRoot\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "$filename ($size x $size) generated!"
}

# Generate all needed sizes
Make-Favicon -size 16 -filename "favicon-16.png"
Make-Favicon -size 32 -filename "favicon.png"
Make-Favicon -size 48 -filename "favicon-48.png"
Make-Favicon -size 180 -filename "apple-touch-icon.png"
Make-Favicon -size 192 -filename "icon-192.png"

Write-Host "`nAll favicons generated successfully!"
