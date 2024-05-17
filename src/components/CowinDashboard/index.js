import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiConstantsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiConstantsStatus.initial,
    vaccinationData: [],
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiConstantsStatus.inProgress,
    })
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedVaccinationDay = {
        last7daysVaccination: data.last_7_days_vaccination.map(eachItem => ({
          vaccineDate: eachItem.vaccine_date,
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
        })),

        vaccinationByAge: data.vaccination_by_age.map(eachItem => ({
          age: eachItem.age,
          count: eachItem.count,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(eachItem => ({
          count: eachItem.count,
          gender: eachItem.gender,
        })),
      }

      this.setState({
        vaccinationData: updatedVaccinationDay,
        apiStatus: apiConstantsStatus.success,
      })
    }
  }

  renderLoaderView = () => (
    <div>
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  render() {
    const {vaccinationData} = this.state
    console.log('render', vaccinationData.VaccinationByGender)
    return (
      <div className="cowin-dashboard-bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website-logo"
            className="logo-img"
          />
          <h1 className="main-heading">Co-Win</h1>
        </div>
        <h1 className="main-description">CoWIN Vaccination in India</h1>
        <div>
          <VaccinationCoverage
            vaccinationBy7LastDays={vaccinationData.last7daysVaccination}
          />
          <VaccinationByAge
            vaccinationGenderData={vaccinationData.vaccinationByGender}
          />
          <VaccinationByGender
            vaccinationAgeData={vaccinationData.vaccinationByAge}
          />
        </div>
      </div>
    )
  }
}

export default CowinDashboard
