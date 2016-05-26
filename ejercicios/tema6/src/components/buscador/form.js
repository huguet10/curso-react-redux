import React, { Component, PropTypes } from 'react';

class Form extends Component {
  constructor(props){
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFamilyChange = this.handleFamilyChange.bind(this);
    this.handleAliveChange = this.handleAliveChange.bind(this);
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
  }

  notifyChange(patch){
    //enviamos algo parecido a un PATCH
    //del tipo { name: 'xxx' } o { aliveOnly: false }
    this.props.onQueryChange(patch);
  }

  handleNameChange(e){
    this.notifyChange({ name: e.target.value });
  }

  handleFamilyChange(e){
    this.notifyChange({ family: e.target.value });
  }

  //refactor de los dos anteriores
  handleTextChange(e){
    this.notifyChange({
      [e.target.name]: e.target.value
    })
  }

  handleAliveChange(e){
    this.notifyChange({ aliveOnly: e.target.checked });
  }

  handleSeasonChange(e){
    const season = parseInt(e.target.value);
    const checked = Boolean(e.target.checked);
    let currentSeasons = this.props.filter.seasons;

    if(checked){
      this.notifyChange({ seasons: [...currentSeasons, season] });
    }
    else {
      this.notifyChange({ seasons: currentSeasons.filter(s => s !== season )});
    }
  }

  renderSeasons(allSeasons, currentSeasons){
    return allSeasons.map(s => {
      const isChecked = currentSeasons.indexOf(s) !== -1;
      return (
        <div className='season-option' key={s}>
          { s } <input type="checkbox" checked={ isChecked } value={s} onChange={ this.handleSeasonChange } />
        </div>
      )
    });
  }

  render(){
    //<OPTIONs> para familias
    const familyOptions = this.props.families.map(f => <option key={f} value={f}>{f}</option>);
    // los valores actuales de los controles (el filtro actual)
    const { name, family, aliveOnly, seasons } = this.props.filter;
    // todas las temporadas disponibles
    const { allSeasons } = this.props;
    // generamos los componentes para cada season
    const seasonItems = this.renderSeasons(allSeasons, seasons);

    return (
      <div className="search-form">
      <form>
        <div className="row">
          <div className="col one-half">
            <label htmlFor="name">Actor / personaje</label>
            <input type="text" name="name" value={ name } onChange={ this.handleTextChange } />
          </div>
          <div className="col one-half">
            <label htmlFor="family">Familia</label>
            <select name="family" value={ family } onChange={ this.handleTextChange }>
              <option value="">Todas</option>
              { familyOptions }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col one-half">
            <label htmlFor="alive">Sólo personajes vivos</label>
            <input type="checkbox" name="alive" checked={ aliveOnly } onChange={ this.handleAliveChange } />
          </div>
          <div className="col one-half">
            <fieldset>
              <legend>Aparece en temporada</legend>
              { seasonItems }
            </fieldset>
          </div>
        </div>
      </form>
    </div>
    )
  }
}

Form.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    family: PropTypes.string,
    aliveOnly: PropTypes.bool,
    seasons: PropTypes.arrayOf(PropTypes.number)
  }),
  families: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  allSeasons: PropTypes.arrayOf(React.PropTypes.number).isRequired,
  onQueryChange: PropTypes.func.isRequired
}

export default Form;