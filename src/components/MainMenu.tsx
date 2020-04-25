import React, { Fragment } from 'react';
import './MainMenu.css';
import DataTableLink from './DataTableLink';

function MainMenu() {
  const dataTables = ["Body Metrics", "Diet", "Reading"]
  const links = dataTables.map( label => {;
    return (
      <DataTableLink key={label} label={label} />
    );
  });

  return (
    <Fragment>
      {links}
    </Fragment>
  )
}

export default MainMenu;

