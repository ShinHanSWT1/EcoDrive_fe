pipeline {
    agent any

    environment {
        REGISTRY = "registry-gorani.lab.terminal-lab.kr"
        HARBOR_CREDENTIALS_ID = "harbor-auth"

        GIT_URL = "https://github.com/ShinHanSWT1/EcoDrive_fe.git"
        GIT_BRANCH_TEST = "dev"
        GIT_BRANCH_PROD = "master"
        
        PROJECT_NAME = "gorani"
        IMAGE_NAME = "frontend"

        REMOTE_SERVER = "10.0.1.79"
        REMOTE_USER = "rocky"
        REMOTE_POD_NAME = "gorani-dev-pod"
        CONTAINER_NAME = "dev-front"

        FULL_IMAGE_TAG = "${REGISTRY}/${PROJECT_NAME}/${IMAGE_NAME}:${BUILD_NUMBER}"
        LATEST_IMAGE_TAG = "${REGISTRY}/${PROJECT_NAME}/${IMAGE_NAME}:latest"

        // build-time env
        VITE_API_BASE_URL = "https://dev-gorani.lab.terminal-lab.kr/api"
        VITE_PAY_BASE_URL = "https://dev-gorani.lab.terminal-lab.kr/pay"
    }

    stages {
        stage('1. Checkout') {
            steps {
                git branch: "${GIT_BRANCH_TEST}", url: "${GIT_URL}"
            }
        }

        stage('2. Build Image') {
            steps {
                sh """
                    podman build \
                      --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} \
                      --build-arg VITE_PAY_BASE_URL=${VITE_PAY_BASE_URL} \
                      -t ${FULL_IMAGE_TAG} .
                """
                sh "podman tag ${FULL_IMAGE_TAG} ${LATEST_IMAGE_TAG}"
            }
        }

        stage('3. Push to Harbor') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${HARBOR_CREDENTIALS_ID}",
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh '''
                        podman login ${REGISTRY} -u "${USER}" -p "${PASS}"
                        podman push ${FULL_IMAGE_TAG} --tls-verify=false
                        podman push ${LATEST_IMAGE_TAG} --tls-verify=false
                    '''
                }
            }
        }

        stage('4. Cleanup Local Images') {
            steps {
                sh '''
                    podman rmi ${FULL_IMAGE_TAG} || true
                    podman rmi ${LATEST_IMAGE_TAG} || true
                '''
            }
        }

        stage('5. Deploy Dev') {
            steps {
                sshagent(['dev-server-ssh']) {
                    withCredentials([
                        usernamePassword(
                            credentialsId: "${HARBOR_CREDENTIALS_ID}",
                            usernameVariable: 'USER',
                            passwordVariable: 'PASS'
                        )
                    ]) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_SERVER} << EOF
                                sudo podman login ${REGISTRY} -u "${HARBOR_USER}" -p "${HARBOR_PASS}" --tls-verify=false
                                sudo podman pull ${FULL_IMAGE_TAG} --tls-verify=false

                                sudo podman rm -f ${CONTAINER_NAME} || true

                                sudo podman run -d --name ${CONTAINER_NAME} \
                                  --pod ${REMOTE_POD_NAME} \
                                  --restart always \
                                  ${FULL_IMAGE_TAG}

                                sudo podman image prune -f
                                sudo podman ps -a --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}"
                            EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'DEV frontend 배포 완료'
        }
        failure {
            echo 'DEV frontend 배포 실패'
        }
    }
}