pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/shantanuk7/blur-app.git',
            credentialsId: '997092da-5bee-45b2-b45b-7a5cf133832a'
      }
    }

    stage('Build Containers') {
      steps {
        sh """
          docker compose -f ${COMPOSE_FILE} build --no-cache
        """
      }
    }

    stage('Deploy') {
      steps {
        sh """
          docker compose -f ${COMPOSE_FILE} down
          docker compose -f ${COMPOSE_FILE} up -d --remove-orphans
        """
      }
    }

    stage('Health Check') {
      steps {
        sh 'sleep 8'
        sh 'curl -sSf http://127.0.0.1:5000/api/auth/health'
      }
    }
  }

  post {
    success {
      echo "Deployment succeeded"
    }
    failure {
      echo "Deployment failed"
    }
  }
}
