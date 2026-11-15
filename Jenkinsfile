pipeline {
  agent any
  environment {
    IMAGE = "${env.DOCKERHUB_USER}/devops-pbl3"
    TAG   = "${BUILD_NUMBER}"
  }
  triggers { pollSCM('H/2 * * * *') }
  stages {
    stage('Checkout')       { steps { checkout scm } }
    stage('Install & Test') { steps { sh 'npm ci && npm test' } }
    stage('Build Image')    { steps { sh 'docker build -t $IMAGE:$TAG -t $IMAGE:latest .' } }
    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                         usernameVariable: 'DU', passwordVariable: 'DP')]) {
          sh 'echo "$DP" | docker login -u "$DU" --password-stdin'
          sh 'docker push $IMAGE:$TAG && docker push $IMAGE:latest'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          sed -e "s|IMAGE_PLACEHOLDER|$IMAGE:$TAG|g" \
              -e "s|VERSION_PLACEHOLDER|v$TAG|g" k8s/deployment.yaml | kubectl apply -f -
          kubectl apply -f k8s/service.yaml
          kubectl rollout status deployment/devops-app --timeout=120s
        '''
      }
    }
  }
  post {
    success { echo "Deployed $IMAGE:$TAG to Kubernetes" }
    always  { sh 'docker logout || true' }
  }
}
