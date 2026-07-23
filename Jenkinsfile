pipeline {
    agent any

    parameters {
        string(
            name: 'BRANCH_NAME',
            defaultValue: 'main',
            description: 'GitHub Branch'
        )

        booleanParam(
            name: 'DEPLOY',
            defaultValue: false,
            description: 'Deploy Docker Containers'
        )
    }

    environment {

        GITHUB_URL = 'https://github.com/vikas-ss0407/OnionGuard_Devops.git'

        FRONTEND_IMAGE = 'vikasss0407/onionguardfrontend'
        BACKEND_IMAGE  = 'vikasss0407/onionguardbackend'
        
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {

                git branch: params.BRANCH_NAME,
                    credentialsId: 'vikas_github_repo',
                    url: env.GITHUB_URL
            }
        }

        stage('Copy Backend .env') {

            steps {

                withCredentials([
                    file(
                        credentialsId: 'OnionGuard_Backend',
                        variable: 'ENV_FILE'
                    )
                ]) {

                    sh '''
                    cp "$ENV_FILE" backend/.env
                    '''

                }

            }

        }

        stage('Build Frontend Image') {

            steps {

                dir('frontend') {

                    sh """
                    docker build \
                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                    """

                }

            }

        }

        stage('Build Backend Image') {

            steps {

                dir('backend') {

                    sh """
                    docker build \
                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} .
                    """

                }

            }

        }

        stage('Docker Login') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'Vikas_Docker',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                    echo "$DOCKER_PASSWORD" | docker login \
                    -u "$DOCKER_USERNAME" \
                    --password-stdin
                    '''

                }

            }

        }

      stage('Push Frontend Image') {

    steps {

        sh """
        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest

        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

        docker push ${FRONTEND_IMAGE}:latest
        """

    }

}

        stage('Push Backend Image') {

    steps {

        sh """
        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest

        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}

        docker push ${BACKEND_IMAGE}:latest
        """

    }

}

        stage('Deploy Docker Containers') {

            when {

                expression {
                    return params.DEPLOY
                }

            }

            steps {

                sh '''

                docker network inspect onionguardnetwork >/dev/null 2>&1 || \
                docker network create onionguardnetwork

                docker rm -f onionguardfrontendcontainer || true
                docker rm -f onionguardbackendcontainer || true

                docker run -d \
                --name onionguardbackendcontainer \
                --network onionguardnetwork \
                -p 5002:5000 \
                --env-file backend/.env \
                vikasss0407/onionguardbackend:${IMAGE_TAG}

                docker run -d \
                --name onionguardfrontendcontainer \
                --network onionguardnetwork \
                -p 5001:5173 \
                vikasss0407/onionguardfrontend:${IMAGE_TAG}

                '''

            }

        }

    }

    post {

        success {

            echo "Pipeline Completed Successfully."

        }

        failure {

            echo "Pipeline Failed."

        }

        always {

            sh 'docker logout || true'

        }

    }

}
