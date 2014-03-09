@echo off
setLocal
set BASE_DIR=%CD%
set ERR_CODE=0

rem Check prerequesites
call :checkDependency "git"
call :checkDependency "npm"
call :checkDependency "bower"

call :cloneRepo https://github.com/coolbloke1324/ige_prototype.git ige
call :doPrepareRepo ige/server

goto end

:checkDependency
where /Q %~1
if ERRORLEVEL 1 call :missingDep %~1
goto end

:cloneRepo
if %ERR_CODE%==0 call :doClone %~1 %~2
goto end

:prepareTheme
if %ERR_CODE%==0 call :doPrepareTheme %~1
goto end

:doClone
if exist %BASE_DIR%/%~2/. goto end
echo.
echo **************************************************************************
echo                           Cloning into %~2
echo **************************************************************************
echo.
call git clone -b master %~1 %~2
if ERRORLEVEL 1 set ERR_CODE=1
goto end

:doPrepareRepo
echo.
echo **************************************************************************
echo                           Preparing repo %~1
echo **************************************************************************
echo.
cd %BASE_DIR%/%~1
call npm install
goto end

:end
cd %BASE_DIR%
endLocal
exit /b
