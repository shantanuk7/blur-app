pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {

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
    success { echo "Deployment succeeded" }
    failure { echo "Deployment failed" }
  }
}
