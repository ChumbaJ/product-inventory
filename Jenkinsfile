@Library('my-lib') _

pipeline {
    stages {
        stage("versioning") {
            steps {
                script {
                    chver()
                }
            }
        }

        stage("building") {
            steps {
                script {
                    buildApp()
                }
            }
        }

        stage("building docker image") {
            steps {
                script {
                    buildImage()
                }
            }
        }

        stage("deploy") {
            steps {
                script {
                    echo "Deploying..."
                }
            }
        }
    }
}