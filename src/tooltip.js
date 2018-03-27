import React from 'react'

export default class Tooltip extends React.Component {

    render() {
	const { tooltipText } = this.props.text;
	if (undefined !== tooltipText) {
	    return (
		    <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
		    <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w240 clip txt-truncate">
		    <div><strong className='mr3'>{tooltipText}</strong></div>
		    </div>
		    <span className="flex-child color-gray-dark triangle triangle--d"></span>
		    </div>
	    );
	} else {
	    return null;
	}
    }
}
