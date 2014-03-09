@echo off
setLocal
set BASE_DIR=%CD%
set ERR_CODE=0

cd %BASE_DIR%/ige
node ./server/ige -g ../soi
goto end

:end
cd %BASE_DIR%
endLocal
exit /b