import React, { Component } from 'react'
import styles from './app.module.scss'
import {
  FileCard,
  FolderCard,
  UploadCard,
  TrashCard,
  FolderFunctionsCard
} from '../../components/Card'

class App extends Component {
  render () {
    return (
      <div className={styles.App}>
        <FileCard
          fileName={'PooFile.txt'}
          fileId={1}
          trashFile={console.log}
          downloadFile={console.log}
        />
        <FolderCard
          folderName={'PooFile.txt'}
          folderId={1}
          trashFolder={console.log}
          downloadFolder={console.log}
          openFolder={console.log}
        />
        <UploadCard
          fileType='file'
          upload={() => console.log('uploading file...')}
        />
        <TrashCard
          name="Don't delete me.txt"
          id={2}
          deleteForever={console.log}
          restore={console.log}
          fileType='file'
        />
        <FolderFunctionsCard
          createFolder={console.log}
          uploadFolder={console.log}
        />
      </div>
    )
  }
}

export default App
