[app]

title = MyEstia
package.name = myestia
package.domain = org.myestia

source.dir = PersonalTaskReminderSystem1

source.include_exts = py,png,jpg,jpeg,kv,atlas,html,css,js,json,db,woff,woff2,ttf,svg,ico,txt,md,map

source.exclude_dirs = __pycache__,.git,.github,tests,.vscode,.idea,api

source.exclude_patterns = *.pyc,*.pyo,*.log,myestia.db,vercel.json

version = 1.0.0

requirements = python3==3.11.10,hostpython3==3.11.10,flask==3.0.3,werkzeug==3.0.3,jinja2==3.1.4,itsdangerous==2.2.0,click==8.1.7,blinker==1.8.2,markupsafe==2.1.5,pyjnius

orientation = portrait

fullscreen = 0

android.permissions = INTERNET,ACCESS_NETWORK_STATE,POST_NOTIFICATIONS,WAKE_LOCK,VIBRATE

android.api = 33

android.minapi = 21

android.ndk = 25b

android.archs = arm64-v8a

android.allow_backup = True

android.presplash_color = #090d16

android.wakelock = True

android.apptheme = @android:style/Theme.NoTitleBar

android.version_code = 1

android.accept_sdk_license = True

p4a.bootstrap = webview

p4a.branch = master

[buildozer]

log_level = 2

warn_on_root = 1
