﻿SET IDENTITY_INSERT [dbo].[Images] ON
INSERT INTO [dbo].[Images] ([ImageId], [ImageData], [URL], [FileType]) SELECT 1, *, N'image1', N'image/png' FROM OPENROWSET(BULK N'C:\Users\tet.di\OneDrive\Pictures\Cyberpunk 2077\photomode_03052021_020317.png', SINGLE_BLOB) rs
INSERT INTO [dbo].[Images] ([ImageId], [ImageData], [URL], [FileType]) SELECT 2, *, N'image2', N'image/png' FROM OPENROWSET(BULK N'C:\Users\tet.di\OneDrive\Pictures\Cyberpunk 2077\photomode_10052021_173833.png', SINGLE_BLOB) rs
INSERT INTO [dbo].[Images] ([ImageId], [ImageData], [URL], [FileType]) SELECT 3, *, N'image3', N'image/png' FROM OPENROWSET(BULK N'C:\Users\tet.di\OneDrive\Pictures\Cyberpunk 2077\photomode_30042021_011759.png', SINGLE_BLOB) rs
INSERT INTO [dbo].[Images] ([ImageId], [ImageData], [URL], [FileType]) SELECT 4, *, N'image4', N'image/png' FROM OPENROWSET(BULK N'C:\Users\tet.di\OneDrive\Pictures\Cyberpunk 2077\photomode_29042021_234341.png', SINGLE_BLOB) rs
SET IDENTITY_INSERT [dbo].[Images] OFF