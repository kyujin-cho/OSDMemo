import React from 'react'
import GoogleMapReact from 'google-map-react'
import axios from 'axios'
import Modal from 'react-modal'
import DatePicker from 'react-datepicker'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'

require('babel-polyfill')
Modal.setAppElement('main.mdl-layout__content')
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}
function getUserPosition() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

class NoteApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {notes: {}, isOpen: false, title: '', contents: '', data: '', key: '', searchKwd: ''}
  }

  addNote(key, note) {
    note['hide'] = false
    let newNote = this.state.notes
    newNote[key] = note
    this.setState({
      notes: newNote
    })
  }

  async deleteNote(key, note) {
    console.log('mocking ' + note._id + ' delete request')
    
    const response = await axios.delete('/api/notes/' + note._id)
    if(response.data.success) {
      const newNote = this.state.notes
      delete newNote[key]
      this.setState({
        notes: newNote
      })
    }
  }

  openEditNote(key, note) {
    this.setState({
      data: note,
      key: key,
      title: note.title,
      contents: note.contents
    })
    this.openModal()
  }
  async componentDidMount() {
    const response = await axios.get('/api/notes')
    console.log(response)
    
    for(const key in response.data.result) {
      response.data.result[key]['hide'] = false
    }
    this.setState({
      notes: response.data.result
    })
  }

  closeDrawer() {
    const drawer = document.getElementsByClassName('mdl-layout__drawer')[0]
    drawer.className = 'mdl-layout__drawer'
    drawer.setAttribute('aria-hidden', 'true')
    document.getElementsByClassName('mdl-layout__drawer-button')[0].setAttribute('aria-expanded', 'false')
    document.getElementsByClassName('mdl-layout__obfuscator')[0].className = 'mdl-layout__obfuscator'
  }

  showNote() {
    this.closeModal()
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: block;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: none;')
    this.closeDrawer()
  }

  showWriteNote() {
    this.closeModal()
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: block;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: none;')
    this.closeDrawer()
  }

  showSetting() {
    this.closeModal()
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: block;')
    this.closeDrawer()
  }
  getParent() {
    return document.querySelector('main.mdl-layout__content')
  }
  
  openModal() {
    this.setState({isOpen: true})
    document.querySelector('main.mdl-layout__content').setAttribute('style', 'display: none;')
  }
  afterOpenModal() {
    // this.subtitle.style.color = '#f00'
  }
  closeModal() {
    this.setState({isOpen: false})
    document.querySelector('main.mdl-layout__content').removeAttribute('style')
  }
  changeTitle(event) {
    this.setState({
      title: event.target.value
    })
  }
  changeContents(event) {
    this.setState({
      contents: event.target.value
    })
  }
  changeSearchKwd(event) {
    this.setState({searchKwd: event.target.value})
    const tmp = this.state.notes
    if(event.target.value === '') 
      for(const key in tmp)
        tmp[key]['hide'] = false
    else
      for(const key in tmp)
        tmp[key]['hide'] = (tmp[key].title.indexOf(event.target.value) == -1) && (tmp[key].contents.indexOf(event.target.value) == -1)        
    this.setState({
      notes: tmp
    })
  
  }
  
  async editNote(event) {
    event.preventDefault()
    const title = this.state.title
    const contents = this.state.contents
    console.log(this.state.key)
    
    const response = await axios.put('/api/notes/' + this.state.key, {
      title: title, 
      contents: contents
    })

    console.log(response.data)
    
    if(response.data.success) {
      let tmp = this.state.notes
      tmp[this.state.key] = response.data.note
      console.log(response.data.note)
      await this.setState({
        title: '',
        contents: '',
        notes: tmp
      })
      this.closeModal()
      // this.props.showNote()
    }
  }

  render() {
    return (
      <div>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <header className="mdl-layout__header">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Note Taking App</span>
              <div className="mdl-layout-spacer"></div>
              <div className="mdl-layout-spacer"></div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search-exp">
                  <i className="material-icons">search</i>
                </label>
                <div className="mdl-textfield__expandable-holder">
                  <input className="mdl-textfield__input" value={this.state.searchKwd} onChange={this.changeSearchKwd.bind(this)} id="search-exp" type="text"/>
                </div>
              </div>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">Title</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" onClick={this.showNote.bind(this)}>View Notes</a>
              <a className="mdl-navigation__link" onClick={this.showWriteNote.bind(this)}>Write Note</a>
              <a className="mdl-navigation__link" onClick={this.showSetting.bind(this)}>Settings</a>
            </nav>
          </div>
          <main className="mdl-layout__content">
            <NoteList editNote={this.openEditNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={this.state.notes} />
            {/*<Notes className="notes" notes={this.state.notes} addNote={this.addNote.bind(this)} />*/}
            <WriteNote className="writeNote" addNote={this.addNote.bind(this)} showNote={this.showNote.bind(this)}/>
            <Settings className="settings" />
          </main>
          <div id="loading-toast" className="mdl-js-snackbar mdl-snackbar" >
            <div className="mdl-snackbar__text"></div>
            <button className="mdl-snackbar__action" type="button"></button>
          </div>
        </div>
        <Modal
          isOpen={this.state.isOpen}
          onAfterOpen={this.afterOpenModal.bind(this)}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel={'Edit Note ' + this.state.data.title}
          ariaHideApp={true}
        >
          <div className="write-card-wide mdl-card mdl-shadow--2dp writeNote" >
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Write Memo</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <form onSubmit={this.editNote.bind(this)}>
                <div className="mdl-grid">
                  <div className="mdl-cell--12-col">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <input className="mdl-textfield__input" id="title-text" value={this.state.title} onChange={this.changeTitle.bind(this)} type="text" name="title"/>
                    </div>
                  </div>
                  <div className="mdl-cell--6-col">
                    <div className="mdl-textfield mdl-js-textfield">
                      <textarea className="mdl-textfield__input" id="contents-text" value={this.state.contents} onChange={this.changeContents.bind(this)} type="text" name="contents" rows="10"></textarea>
                    </div>
                  </div>
                  <div className="mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
                    <ReactMarkdown source={this.state.contents} />
                  </div>
                  <div className="mdl-cell--12-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored right-align" type="submit">Write</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="mdl-card-actions mdl-card--border" />
          </div>
        </Modal>
      </div>
    )
  }
}

class NoteList extends React.Component {
  render() {
    let Notes = []
    for(const key in this.props.notes) {
      console.log('1111')
      console.log(key)      
      if(!this.props.notes[key]['hide'])
        Notes.push(<Note data={this.props.notes[key]} key={key} k={key} editNote={this.props.editNote} deleteNote={this.props.deleteNote} />)
    }
    
    return (
      <div className="notes">
        {Notes}
      </div>
    )
  }
}
class Note extends React.Component {
  getParent() {
    return document.querySelector('main.mdl-layout__content')
  }
  render() {    
    const date = moment(this.props.data.time).format('MMMM Do YYYY')
    const AnyReactComponent = ({ text }) => <div>{text}</div>
    let GoogleMap
    if(this.props.data.latitude !== -200) {
      try {
        GoogleMap = (
          <div>
            <i className="material-icons">location_on</i>          
            <GoogleMapReact
              defaultCenter={{lat: this.props.data.latitude, lon: this.props.data.longitude}}
              defaultZoom={11}
            >
              <AnyReactComponent
                lat={this.props.data.latitude}
                lon={this.props.data.longitude}
                text={'You\'re here!'} />
            </GoogleMapReact>
          </div>
        )
      } catch (error) {
        GoogleMap = 
          <div>
            <i className="material-icons">location_off</i>
            <span>No Location Record</span>
          </div>
        
      }
    } else {
      GoogleMap = (
        <div>
          <i className="material-icons">location_off</i>
          <span>No Location Record</span>
        </div>
      )
    }
    return (
      <div>
        <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mld-cell--4-col-phone">
          <div className="demo-card-wide mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">{this.props.data.title}</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <ReactMarkdown source={this.props.data.contents} />
            </div>
            <div className="mdl-card-actions mdl-card--border">
              <div className="mdl-grid">
                <div className="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                  <i className="material-icons">date_range</i>
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-tablet mdl-cell--3-col-phone">
                  <span>{date}</span>
                </div>
                <div className="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                  
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-tablet mdl-cell--3-col-phone">
                  {GoogleMap}
                </div>
                <div className="mdl-cell mdl-cell--2-col mdl-cell--7-col-tablet mdl-cell--2-col-phone">
                  <button className="right-align mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={() => {this.props.editNote(this.props.k, this.props.data)}}>
                  <i className="material-icons">edit</i>
                  </button> 
                </div>
                <div className="mdl-cell mdl-cell--2-col mdl-cell--1-col-tablet mdl-cell--2-col-phone">
                  <button className="right-align mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={() => {this.props.deleteNote(this.props.k, this.props.data)}}>
                  <i className="material-icons">delete</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class WriteNote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {title: '', contents: '', date: moment()}
  }
  changeTitle(event) {
    this.setState({
      title: event.target.value
    })
  }
  changeContents(event) {
    this.setState({
      contents: event.target.value
    })
  }
  changeDate(date) {
    this.setState({
      date: date
    })
  }
  
  async writeNote(event) {
    event.preventDefault()
    let title = this.state.title
    let contents = this.state.contents
    if(!title || !contents) {
      alert('내용 및 제목을 입력해 주세요!')
      return
    }

    document.getElementsByClassName('note-write-loading')[0].setAttribute('style', 'display:block;')
    document.querySelector('#loading-toast').MaterialSnackbar.showSnackbar({message: 'Posting note...'})

    let latitude, longitude
    
    if(navigator.geolocation) {
      try { 
        const location = await getUserPosition()
        latitude = location.coords.latitude
        longitude = location.coords.longitude
      } catch(error) {
        latitude = -200
        longitude = -200
      }
    } else {
      latitude = -200
      longitude = -200
    }
    const dateString = await this.state.date.toISOString()
    console.log(dateString)
    
    
    const response = await axios.post('/api/notes', {
      title: title, 
      contents: contents,
      latitude: latitude,
      longitude: longitude,
      date: dateString
    })

    console.log(response.data)
    document.getElementsByClassName('note-write-loading')[0].setAttribute('style', 'display:none;')
    
    if(response.data.success) {
      this.props.addNote(response.data.key, response.data.note)
      await this.setState({
        title: '',
        contents: ''
      })
      this.props.showNote()
      document.querySelector('#loading-toast').MaterialSnackbar.showSnackbar({message: 'Note posted.'})
    } else {
      document.querySelector('#loading-toast').MaterialSnackbar.showSnackbar({message: 'Failed to post note!'})

    }

  }
  render() {
    return (
      <div className="write-card-wide mdl-card mdl-shadow--2dp writeNote" style={{display: 'none'}} >
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Write Memo</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <form onSubmit={this.writeNote.bind(this)}>
            <div className="mdl-grid">
              <div className="mdl-cell--12-col">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input className="mdl-textfield__input" id="title-text" value={this.state.title} onChange={this.changeTitle.bind(this)} type="text" name="title"/>
                  <label className="mdl-textfield__label" htmlFor="title-text">Title</label>
                </div>
              </div>
              <div className="mdl-cell--12-col">
                <div className="mdl-textfield mdl-js-textfield">
                  <textarea className="mdl-textfield__input" id="contents-text" value={this.state.contents} onChange={this.changeContents.bind(this)} type="text" name="contents" rows="10"></textarea>
                  <label className="mdl-textfield__label" htmlFor="contents-text">Content</label>
                   <ReactMarkdown source={this.state.contents} />
                </div>
                
              </div>
              
              <div className="mdl-cell--6-col">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored right-align" type="submit">Write</button>
              </div>
              <div className="mdl-cell--12-col">
                <div id="p2" className="mdl-progress mdl-js-progress note-write-loading mdl-progress__indeterminate" style={{display: 'none'}}></div>
              </div>
            </div>
          </form>
        </div>
        <div className="mdl-card-actions mdl-card--border" />
      </div>
    )
  }
}

class Settings extends React.Component {
  render() {
    return (
      <div className="settings-card-wide mdl-card mdl-shadow--2dp settings" style={{display: 'none'}}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Settings</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <ul className="mdl-list">
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Github Integration</span>
                <span className="mdl-list__item-text-body">Log in to sync your memo with Github repository</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">arrow_forward</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Change Background</span>
                <span className="mdl-list__item-text-body">Upload new background image</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">file_upload</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Enable/Disable keychain</span>
                <span className="mdl-list__item-text-body">Set password to protect your memo</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">enhanced_encryption</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Change time zome</span>
                <span className="mdl-list__item-text-body">Change your Time Zone</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">language</i>
                </button>
              </span>
            </li>
          </ul>
        </div>
        <div className="mdl-card-actions mdl-card--border"></div>
      </div>
    )
  }
}


class UploadImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {file: []}
  }
  async onDrop(file) {
    this.setState({
      file
    })
    const response = await axios.post('/background', {
      image: file
    })
    if(response.data.success)
      window.location.reload()
  }
  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone accept="image/*" multiple="false" onDrop={this.onDrop.bind(this)}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
      </section>
    )
  }
}
export default NoteApp