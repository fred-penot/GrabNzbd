path_install=`pwd`
echo "****************************************************************************" > ${path_install}/install.log
echo "*** Lancement de l'installation: " `date` " ***">> ${path_install}/install.log
echo "****************************************************************************" >> ${path_install}/install.log

echo "####################################################################" >> ${path_install}/install.log
echo "## Installation de Ionic, Cordova et Bower avec leurs dependances ##" >> ${path_install}/install.log
echo "####################################################################" >> ${path_install}/install.log

npm install >> ${path_install}/install.log
export PATH=${path_install}/node_modules/cordova/bin:$PATH
export PATH=${path_install}/node_modules/ionic/bin:$PATH
export PATH=${path_install}/node_modules/bower/bin:$PATH

echo "#####################################" >> ${path_install}/install.log
echo "## Installation des modules nodejs ##" >> ${path_install}/install.log
echo "#####################################" >> ${path_install}/install.log

cd ${path_install}/App
npm install >> ${path_install}/install.log

echo "######################################" >> ${path_install}/install.log
echo "## Installation des plugins cordova ##" >> ${path_install}/install.log
echo "######################################" >> ${path_install}/install.log

cd ${path_install}/App
cordova plugin add cordova-plugin-device >> ${path_install}/install.log
cordova plugin add cordova-plugin-console >> ${path_install}/install.log
cordova plugin add cordova-plugin-whitelist >> ${path_install}/install.log
cordova plugin add cordova-plugin-splashscreen >> ${path_install}/install.log
cordova plugin add cordova-plugin-statusbar >> ${path_install}/install.log
cordova plugin add ionic-plugin-keyboard >> ${path_install}/install.log
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git >> ${path_install}/install.log
cordova plugin add cordova-plugin-file >> ${path_install}/install.log
cordova plugin add cordova-plugin-file-transfer >> ${path_install}/install.log

echo "####################################" >> ${path_install}/install.log
echo "## Installation des plugins bower ##" >> ${path_install}/install.log
echo "####################################" >> ${path_install}/install.log

cd ${path_install}/App
bower install --allow-root >> ${path_install}/install.log

echo "###########################" >> ${path_install}/install.log
echo "## Installation du hooks ##" >> ${path_install}/install.log
echo "###########################" >> ${path_install}/install.log

#cd ${path_install}/App
#ionic hooks add >> ${path_install}/install.log

echo "###########################################" >> ${path_install}/install.log
echo "## Installation de la plateforme Android ##" >> ${path_install}/install.log
echo "###########################################" >> ${path_install}/install.log

#cd ${path_install}/App
#ionic platform add android >> ${path_install}/install.log

echo "#############################" >> ${path_install}/install.log
echo "## Modification des droits ##" >> ${path_install}/install.log
echo "#############################" >> ${path_install}/install.log

chmod -Rf 755 ${path_install}/*

echo "****************************************************************************" >> ${path_install}/install.log
echo "*** Fin de l'installation: " `date` " ***">> ${path_install}/install.log
echo "****************************************************************************" >> ${path_install}/install.log
