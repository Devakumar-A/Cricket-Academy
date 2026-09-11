Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\asus\Desktop\cricket-dynamic\Cricket-Academy\public\logoo.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$size = 512
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Black)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$srcX = 300
$srcY = 300
$srcW = 465
$srcH = 310

$destW = 416
$destH = [int]($destW * ($srcH / $srcW))
$destX = [int]((512 - $destW) / 2)
$destY = [int]((512 - $destH) / 2)

$srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $srcW, $srcH
$destRect = New-Object System.Drawing.Rectangle $destX, $destY, $destW, $destH

$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Clear stray pixels above the logo
$blackBrush = [System.Drawing.Brushes]::Black
$g.FillRectangle($blackBrush, 430, 80, 50, 60)
$g.FillRectangle($blackBrush, 40, 80, 50, 60)

# Rounded gold border
$goldPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(245, 158, 11)), 18
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 65
$d = $r * 2
$rect = New-Object System.Drawing.Rectangle 12, 12, 488, 488
$path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
$path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
$path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
$path.CloseFigure()
$g.DrawPath($goldPen, $path)

$goldPen.Dispose()
$path.Dispose()
$g.Dispose()

# Save public/favicon.png at 96x96
$favPng = New-Object System.Drawing.Bitmap 96, 96
$gFav = [System.Drawing.Graphics]::FromImage($favPng)
$gFav.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFav.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFav.DrawImage($bmp, 0, 0, 96, 96)
$gFav.Dispose()
$favPng.Save("c:\Users\asus\Desktop\cricket-dynamic\Cricket-Academy\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favPng.Dispose()

# Also save 48x48 PNG
$favPng48 = New-Object System.Drawing.Bitmap 48, 48
$gFav48 = [System.Drawing.Graphics]::FromImage($favPng48)
$gFav48.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFav48.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFav48.DrawImage($bmp, 0, 0, 48, 48)
$gFav48.Dispose()
$favPng48.Save("c:\Users\asus\Desktop\cricket-dynamic\Cricket-Academy\public\favicon-48x48.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favPng48.Dispose()

# Create standard Windows multi-res ICO (16, 32, 48)
$sizes = @(16, 32, 48)
$pngBytesList = @()
foreach ($sz in $sizes) {
    $t = New-Object System.Drawing.Bitmap $sz, $sz
    $gt = [System.Drawing.Graphics]::FromImage($t)
    $gt.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gt.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gt.DrawImage($bmp, 0, 0, $sz, $sz)
    $gt.Dispose()
    $ms = New-Object System.IO.MemoryStream
    $t.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $t.Dispose()
    $pngBytesList += ,$ms.ToArray()
    $ms.Dispose()
}

$fs = [System.IO.File]::Create("c:\Users\asus\Desktop\cricket-dynamic\Cricket-Academy\public\favicon.ico")
$bw = New-Object System.IO.BinaryWriter $fs

# Header
$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]$sizes.Count)

$offset = 6 + (16 * $sizes.Count)
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $sz = $sizes[$i]
    $bytes = $pngBytesList[$i]
    $dimByte = [byte]$sz
    $bw.Write($dimByte)                 # Width
    $bw.Write($dimByte)                 # Height
    $bw.Write([byte]0)                  # Color count
    $bw.Write([byte]0)                  # Reserved
    $bw.Write([uint16]1)                # Planes
    $bw.Write([uint16]32)               # BPP
    $bw.Write([uint32]$bytes.Length)    # Size
    $bw.Write([uint32]$offset)          # Offset
    $offset += $bytes.Length
}

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bw.Write($pngBytesList[$i])
}

$bw.Close()
$fs.Close()

$bmp.Dispose()
$src.Dispose()

Write-Output "FAVICON_GENERATION_SUCCESS"
