@Library('my-lib') _

pipeline {
    agent any

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

                    def srvCmd = "bash ./server-cmd.sh"

                    sshagent(['ec2-server']) {
                        // set and copy .env onto EC2
                        sh "echo 'BACKEND_TAG=${env.BACKEND_TAG}' > .env"
                        sh "echo 'FRONTEND_TAG=${env.FRONTEND_TAG}' >> .env"
                        sh "scp .env ec2-user@3.127.40.112:/home/ec2-user"

                        // copy docker-compose onto EC2
                        sh "scp docker-compose.yml ec2-user@3.127.40.112:/home/ec2-user"

                        // copy shell script onto EC2
                        sh "scp server-cmd.sh ec2-user@3.127.40.112:/home/ec2-user"

                        // ssh into EC2
                        sh "ssh -o StrictHostKeyChecking=no ec2-user@3.127.40.112 '${srvCmd}'"
                    }
                }
            }
        }
    }
}