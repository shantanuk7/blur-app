pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--registry-mirror=https://mirror.gcr.io", "--storage-driver=overlay2"]
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build -t server:latest ./server
                        docker build -t client:latest ./client
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401106', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401106_client-server-app \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag + Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401106/server:latest
                        docker tag client:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401106/client:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401106/server:latest
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401106/client:latest
                    '''
                }
            }
        }

        stage('Create Namespace if Not Exists') {
            steps {
                container('kubectl') {
                    sh 'kubectl apply -f k8s-deployment/namespace.yaml || true'
                }
            }
        }

        stage('Create Secrets if Not Exists') {
          steps {
              container('kubectl') {
                  withCredentials([
                      string(credentialsId: 'mongo-uri-2401106', variable: 'MONGO_URI'),
                      string(credentialsId: 'jwt-secret-2401106', variable: 'JWT_SECRET'),
                      string(credentialsId: 'gmail-user-2401106', variable: 'GMAIL_USER'),
                      string(credentialsId: 'gmail-pass-2401106', variable: 'GMAIL_PASS')
                  ]) {
                      sh '''
                          kubectl create secret docker-registry nexus-secret \
                            --docker-server=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                            --docker-username=admin \
                            --docker-password=Changeme@2025 \
                            --namespace=2401106 || true

                          kubectl create secret generic server-secret -n 2401106 \
                            --from-literal=MONGO_URI="$MONGO_URI" \
                            --from-literal=JWT_SECRET="$JWT_SECRET" \
                            --from-literal=GMAIL_USER="$GMAIL_USER" \
                            --from-literal=GMAIL_PASS="$GMAIL_PASS" || true
                      '''
                  }
              }
          }
      }

        stage('Deploy to Kubernetes') {
          steps {
              container('kubectl') {
                  dir('k8s-deployment') {
                      sh '''
                          # Create namespace first (or skip if exists)
                          kubectl apply -f namespace.yaml

                          # Apply deployments and services
                          kubectl apply -f server-deployment.yaml
                          kubectl apply -f server-service.yaml
                          kubectl apply -f client-deployment.yaml
                          kubectl apply -f client-service.yaml

                          # Wait for pods to be ready
                          kubectl rollout status deployment/server -n 2401106
                          kubectl rollout status deployment/client -n 2401106
                      '''
                  }
              }
          }
      }

    }
}
