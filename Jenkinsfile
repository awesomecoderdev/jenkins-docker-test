pipeline {
  agent { dockerfile true }
  stages {
    stage('Test') {
      steps {
        sh '''
          bun --version
          git --version
          curl --version
        '''
      }
    }
  }
}
