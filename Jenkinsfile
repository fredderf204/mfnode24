#!groovy
node {
   stage('source'){
       checkout scm
   }
    withEnv(["PATH+NODE=${tool name: '6.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
        stage('local build'){
            sh 'node -v'
            sh 'npm install --production'
            sh 'npm install --only=dev'
        }
    }
    withEnv(["PATH+NODE=${tool name: '6.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
        stage('local test'){
            sh './node_modules/.bin/grunt --force'
        }
    }    
   stage('build'){
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: '279c4df1-1311-4eb6-ac13-161c67993e2e', passwordVariable: 'spp', usernameVariable: 'spu'],[$class: 'UsernamePasswordMultiBinding', credentialsId: '9cc01334-ddd8-4318-a1c2-424f11c25240', passwordVariable: 'gp', usernameVariable: 'gu']]) {
            withEnv(["PATH+NODE=${tool name: '6.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
                sh '''set +x
                webappname="mfignitedemo4${BRANCH_NAME}"
                echo $webappname
                armtemplate=https://raw.githubusercontent.com/fredderf204/ARMTemplates/master/webapp_localgit_slot_appinsights/azuredeploy.json
                azure login -u "$spu" -p "$spp" --service-principal --tenant "mfriedrich.cloud" -v
                azure config mode arm
                azure group create -n $webappname -l "australia east"
                azure group deployment create --template-uri $armtemplate -g $webappname -n "$webappname" -p {\\"appServicePlanName\\":{\\"value\\":\\"$webappname\\"},\\"webappname\\":{\\"value\\":\\"$webappname\\"},\\"slotName\\":{\\"value\\":\\"staging\\"}}
                sleep 5s
                giturl="https://$gu:$gp@$webappname-staging.scm.azurewebsites.net:443/$webappname.git"
                azuregitremote="azure-$webappname${BUILD_NUMBER}"
                git remote add "$azuregitremote" $giturl
                git push "$azuregitremote"'''
            }    
        }
   }    
    withEnv(["PATH+NODE=${tool name: '6.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
        stage('test'){
            sauce('a542aa3b-977b-40c5-8c57-d234a9bdf496') {
                sauceconnect(options: '', useGeneratedTunnelIdentifier: false, verboseLogging: false) {
                    sh './node_modules/.bin/nightwatch -e chrome --test test/nightwatch.js || true'
                    junit 'reports/**'
                    step([$class: 'SauceOnDemandTestPublisher'])
                }    
            }
            timeout(time:30, unit:'MINUTES') {
                input message:'Yo, do you approve this here deployment?'
            }
        }
    }
   stage('deploy'){
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: '870be9e1-b870-42fb-b169-3a6206d1c142', passwordVariable: 'asmp', usernameVariable: 'asmu'],[$class: 'UsernamePasswordMultiBinding', credentialsId: '9cc01334-ddd8-4318-a1c2-424f11c25240', passwordVariable: 'gp', usernameVariable: 'gu']]) {
            withEnv(["PATH+NODE=${tool name: '6.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
                sh '''set +x
                rm -r /var/jenkins_home/.azure
                webapptoswap="mfignitedemo4${BRANCH_NAME}"
                azure login -u "$asmu" -p "$asmp"
                azure config mode asm
                echo $webapptoswap
                azure site swap -q $webapptoswap'''
            }
        }    
   }
}