import React from "react"
import cx from "classnames"
import { connect } from "react-redux"
import { setFilter } from "../redux/actions/actions"
import { VISIBILITY_FILTERS } from "../constants"

const VisibilityFilters = ({ activeFilter, setFilter }) => {
  const filters = () => {
    return Object.keys(VISIBILITY_FILTERS).map(filterKey => {
      const currentFilter = VISIBILITY_FILTERS[filterKey]
      return (
        <span
          key={`visibility-filter-${currentFilter}`}
          className={cx(
            'filter',
            currentFilter === activeFilter && 'filter-active'
          )}
          onClick={() => {setFilter(currentFilter)}}
        >
          {currentFilter}
        </span>
      )
    })
  }

  return (
    <div className="visibility-filters">
      {filters()}
    </div>
  )

}

const mapStateToProps = state => {
  return { activeFilter: state.visibilityFilter }
}


export default connect(
  mapStateToProps,
  { setFilter }
)(VisibilityFilters)
