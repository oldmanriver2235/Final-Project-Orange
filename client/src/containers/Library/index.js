import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './library.module.scss'
import { FileCard, FolderCard } from '../../components/Card'
import { HomeIcon } from '../../components/Icon'
import Pagination from '../../components/Pagination'
import { Library as LibraryDuck, Modals as ModalsDuck } from '../../ducks'
import { LiveEndpoints } from '../../api'
import { groupArray } from '../../helpers/util'
import { Container, Row, Col } from 'reactstrap'

const { trashFile, trashFolder, setPage, setDisplayFolder } = LibraryDuck
const { toggleOpenFolder, openFolder, editFile } = ModalsDuck

/**
 * Paginator connected to library store.
 * Why won't this work by passing props????!?
 */
const LibraryPaginator = connect(
  state => ({
    currentPage: state.library.currentPage,
    totalPages: state.library.totalPages
  }),
  dispatch => ({
    setPage: index => dispatch(setPage(index))
  })
)(Pagination)

class Library extends Component {
  render () {
    return (
      <Fragment>
        <div className={styles.libDiv}>
          <HomeIcon onClick={() => this.props.setDisplayFolder()} />
          <span className={styles.pathSpan}>
            {' '}
            Browsing: ./
            {this.props.displayFolder
              ? `${this.props.displayFolder.name}/`
              : ` (root)`}
          </span>
          {this.props.activePage
            ? <Container> {groupArray(this.props.activePage.map((e, i) => {
              return e.isFolder ? (
                <Col xl={'3'} lg={'3'} md={'3'} >
                  <FolderCard
                    key={i}
                    folderName={e.name}
                    folderId={e.uid}
                    // openFolder={() => this.props.openFolder(e)}
                    openFolder={() => this.props.openFolder(e.uid)}
                    trashFolder={() => this.props.trashFolder(e.uid)}
                    downloadFolder={() =>
                      LiveEndpoints.Folder.downloadFolder(e.uid)
                    }
                  />
                </Col>
              ) : (
                <Col xl={'3'} lg={'3'} md={'3'} >
                  <FileCard
                    key={i}
                    fileName={e.name}
                    fileId={e.uid}
                    moveFile={() => this.props.editFile(e)}
                    trashFile={() => this.props.trashFile(e.uid)}
                    downloadFile={() => LiveEndpoints.File.downloadFile(e.uid)}
                  />
                </Col>
              )
            }), 4).map(e => (<Row>{e}</Row>))} </Container>
            : null}
        </div>
        <LibraryPaginator />
      </Fragment>
    )
  }
}

// connect(state => ({
//   currentPage: state.trash.currentPage,
//   totalPages: state.trash.totalPages
// }), dispatch => ({
//   setPage: index => dispatch(setPage(index))
// }))(Pagination)

Library.propTypes = {
  activePage: PropTypes.array,
  trashFile: PropTypes.func,
  trashFolder: PropTypes.func,
  toggleOpenFolder: PropTypes.func,
  openFolder: PropTypes.func,
  editFile: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  setPage: PropTypes.func,
  displayFolder: PropTypes.object,
  setDisplayFolder: PropTypes.func
}

const mapStateToProps = state => ({
  activePage: state.library.currentList,
  currentPage: state.library.currentPage,
  totalPages: state.library.totalPages,
  displayFolder: state.library.displayFolder
})

const mapDispatchToProps = dispatch => ({
  trashFile: uid => dispatch(trashFile(uid)),
  trashFolder: uid => dispatch(trashFolder(uid)),
  toggleOpenFolder: () => dispatch(toggleOpenFolder()),
  // openFolder: folder => dispatch(openFolder(folder)),
  openFolder: folder => dispatch(setDisplayFolder(folder)),
  setDisplayFolder: folder => dispatch(setDisplayFolder(folder)),
  editFile: file => dispatch(editFile(file)),
  setPage: index => dispatch(setPage(index))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library)
