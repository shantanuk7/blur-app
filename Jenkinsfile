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
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args: 
    - "--storage-driver=overlay2"
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: workspace-volume
    emptyDir: {}
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

        stage('CHECK') {
            steps {
                echo "DEBUG >>> NEW JENKINSFILE IS ACTIVE"
            }
        }

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
                        docker --version
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag + Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest
                        docker tag client:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/client:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/client:latest
                    '''
                }
            }
        }

        stage('Create Namespace + Secrets') {
            steps {
                container('kubectl') {
                    withCredentials([
                        string(credentialsId: 'mongo-uri-2401106', variable: 'MONGO_URI'),
                        string(credentialsId: 'jwt-secret-2401106', variable: 'JWT_SECRET'),
                        string(credentialsId: 'gmail-user-2401106', variable: 'GMAIL_USER'),
                        string(credentialsId: 'gmail-pass-2401106', variable: 'GMAIL_PASS')
                    ]) {
                        sh '''
                            # Create namespace directly (no YAML file)
                            kubectl get namespace 2401106 || kubectl create namespace 2401106

                            # Docker registry pull secret
                            kubectl create secret docker-registry nexus-secret \
                              --docker-server=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                              --docker-username=admin \
                              --docker-password=Changeme@2025 \
                              --namespace=2401106 || true

                            # Application secrets
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
                    dir('k8s') {
                        sh """
                            # 1. Update Image Tag to match the Build
                            sed -i 's|server:latest|server:${BUILD_NUMBER}|g' deployment.yaml
                            sed -i 's|client:latest|client:${BUILD_NUMBER}|g' deployment.yaml
                            
                            # 2. Deploy (Fire and Forget)
                            kubectl apply -f .
                            
                            # 3. Optional: Print status
                            kubectl get pods -n 2401106
                        """
                    }
                }
            }
        }

    }
}
