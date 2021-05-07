SET IDENTITY_INSERT [dbo].[Images] ON
INSERT INTO [dbo].[Images]
([ImageId], [ImageData], [URL])
SELECT 1, *, N'.png' FROM OPENROWSET(BULK N'C:\Users\tet.di\OneDrive\Pictures\Cyberpunk 2077\photomode_03052021_020317.png', SINGLE_BLOB) rs
SET IDENTITY_INSERT [dbo].[Images] OFF