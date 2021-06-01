#!groovy
@Library("shared-library@master") _

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    tools {
        jdk 'openjdk11'
    }

    environment {                
        MAVEN_GLOBAL_SETTINGS = 'shared-maven-global-settings'
        MAVEN_INSTALLATION = 'maven3.6'
        SONAR_INSTALLATION = 'sonar8'
    }

    stages {

        stage ('Start') {
            steps {
                sendNotifications currentBuild
            }
        }

        stage('Clean') {
            steps {
                withMaven(
                    globalMavenSettingsConfig: env.MAVEN_GLOBAL_SETTINGS,
                    options: [artifactsPublisher(disabled: true)],
                    maven: env.MAVEN_INSTALLATION
                    ) {
                    sh "mvn -B clean"
                }
            }
        }
        
        stage('Build') {
            steps {

                withMaven(
                    globalMavenSettingsConfig: env.MAVEN_GLOBAL_SETTINGS,
                    options: [artifactsPublisher(disabled: true)],
                    maven: env.MAVEN_INSTALLATION
                    ) {    
                    sh "mvn -B package -DskipTests -U"
                }
            }
        }

        stage('SonarQube Analysis') {
            steps { 
                withMaven(                    
                    globalMavenSettingsConfig: env.MAVEN_GLOBAL_SETTINGS,                    
                    options: [artifactsPublisher(disabled: true)],
                    maven: env.MAVEN_INSTALLATION                   
                    ) {
                    withSonarQubeEnv(env.SONAR_INSTALLATION) {
                        runSonar()
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {      
                    waitForQualityGate abortPipeline: true
                }                
            }
        }

        stage('Deploy') {
            when { anyOf { buildingTag();  branch 'develop'; branch 'release/*'; branch 'hotfix/*'} }
            steps {

                withMaven(
                    globalMavenSettingsConfig: env.MAVEN_GLOBAL_SETTINGS,
                    options: [artifactsPublisher(disabled: true)],
                    maven: env.MAVEN_INSTALLATION
                    ) {
                    sh "mvn -B deploy -DskipTests"
                }
            }
        }
    }

    post {
        always {
            sendNotifications currentBuild
        }
    }                
}
