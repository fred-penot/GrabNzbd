current_path=`pwd`

cd ${current_path}/keystore
keytool -genkey -v -keystore grabnzbd.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000