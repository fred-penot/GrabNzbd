current_path=`pwd`

isInPathCordova=`echo $PATH | grep /node_modules/cordova/bin | wc -l`
if [ $isInPathCordova -eq 0 ] ; then
	export PATH=${current_path}/node_modules/cordova/bin:$PATH
fi

cd ${current_path}/App
cordova build --release > ${current_path}/build.log

cd ${current_path}/App/platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${current_path}/keystore/grabnzbd.keystore android-release-unsigned.apk alias_name >> ${current_path}/build.log
#zipalign -v 4 android-release-unsigned.apk GrabNzbd.apk >> ${current_path}/build.log

rm -f ${current_path}/GrabNzbd.apk
mv -f ${current_path}/App/platforms/android/build/outputs/apk/android-release-unsigned.apk ${current_path}/GrabNzbd.apk