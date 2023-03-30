import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Navbar from '../NavBar'
import ProjectItem from '../ProjectItem'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const Projects = () => {
  const [projectsList, setData] = useState()
  const [retryBtn, setRetryBtn] = useState(false)

  const [apiStatus, setApiStatus] = useState({
    status: apiStatusConstant.initial,
    error: null,
    data: null,
  })

  const onClickRetryBtn = () => {
    setRetryBtn(prevState => !prevState)
  }

  const onEventChange = event => {
    setData(event.target.value)
  }

  useEffect(() => {
    const getDataProjects = async () => {
      setApiStatus({
        status: apiStatusConstant.inProgress,
        error: null,
        data: null,
      })

      const url = `https://apis.ccbp.in/ps/projects?category=${projectsList}`
      const options = {
        method: 'GET',
      }
      const res = await fetch(url, options)
      if (res.ok === true) {
        const data = await res.json()
        const updatedProjects = data.projects.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          name: each.name,
        }))
        setApiStatus(prevState => ({
          ...prevState,
          status: apiStatusConstant.success,
          data: updatedProjects,
        }))
      } else {
        setApiStatus(prevState => ({
          ...prevState,
          status: apiStatusConstant.failure,
          error: res.error_msg,
        }))
      }
    }
    getDataProjects()
  }, [projectsList, retryBtn])

  const renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={60} width={80} />
    </div>
  )

  const renderSuccessView = () => {
    const {data} = apiStatus
    const projectsView = data.map(each => (
      <ProjectItem eachDetails={each} key={each.id} />
    ))
    return projectsView
  }

  const renderFailureView = () => (
    <div className="notContainer">
      <img
        className="notFound"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1 className="oops">Oops! Something Went Wrong</h1>
      <p className="not">We cannot seem to find the page you are looking for</p>
      <navigate to="/">
        <button className="retry" onClick={onClickRetryBtn} type="button">
          Retry
        </button>
      </navigate>
    </div>
  )
  const finalRendering = () => {
    const {status} = apiStatus
    switch (status) {
      case apiStatusConstant.success:
        return renderSuccessView()
      case apiStatusConstant.failure:
        return renderFailureView()
      case apiStatusConstant.inProgress:
        return renderLoadingView()

      default:
        return null
    }
  }

  return (
    <div>
      <Navbar />
      <div>
        <select className="select" onChange={onEventChange}>
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <ul>{finalRendering()}</ul>
      </div>
    </div>
  )
}

export default Projects
