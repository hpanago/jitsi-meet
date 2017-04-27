import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Dialog,
    hideDialog
} from '../../base/dialog';
import { translate } from '../../base/i18n';
import { getParticipantById } from '../../base/participants';

declare var APP: Object;

/**
 * Implements a dialog for remote control authorization.
 */
class RemoteControlAuthorizationDialog extends Component {
    /**
     * RemoteControlAuthorizationDialog component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * The display name of the participant who is requesting authorization
         * for remote desktop control session.
         *
         * @private
         */
        _displayName: React.PropTypes.string,

        /**
         * Used to show hide the dialog on cancel.
         */
        dispatch: React.PropTypes.func,

        /**
         * The ID of the participant who is requesting authorization for remote
         * desktop control session.
         *
         * @public
         */
        participantId: React.PropTypes.string,

        /**
         * Invoked to obtain translated strings.
         */
        t: React.PropTypes.func
    }

    /**
     * Initializes a new RemoteControlAuthorizationDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Renders additional message text for the dialog.
     *
     * @private
     * @returns {ReactElement}
     */
    _getAdditionalMessage() {
        // FIXME: Once we have this information in redux we should
        // start getting it from there.
        if (APP.conference.isSharingScreen) {
            return null;
        }

        return (
            <div>
                <br />
                { this.props.t('dialog.remoteControlShareScreenWarning') }
            </div>
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <Dialog
                cancelTitleKey = { 'dialog.Cancel' }
                okTitleKey = { 'dialog.Allow' }
                onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.remoteControlTitle'
                width = 'small'>
                {
                    this.props.t('dialog.remoteControlRequestMessage',
                    { user: this.props._displayName })
                }
                {
                    this._getAdditionalMessage()
                }
            </Dialog>
        );
    }

    /**
     * Cleans existing preview tracks and signal to closeDeviceSelectionDialog.
     *
     * @private
     * @returns {boolean} Returns false to prevent closure until cleanup is
     * complete.
     */
    _onCancel() {
        // FIXME: This should be action one day.
        APP.remoteControl.receiver.deny(this.props.participantId);

        return true;
    }

    /**
     * Identify changes to the preferred input/output devices and perform
     * necessary cleanup and requests to use those devices. Closes the modal
     * after cleanup and device change requests complete.
     *
     * @private
     * @returns {boolean} Returns false to prevent closure until cleanup is
     * complete.
     */
    _onSubmit() {
        this.props.dispatch(hideDialog());

        // FIXME: This should be action one day.
        APP.remoteControl.receiver.grant(this.props.participantId);

        return false;
    }
}

/**
 * Maps (parts of) the Redux state to the RemoteControlAuthorizationDialog's
 * props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The React Component props passed to the associated
 * (instance of) RemoteControlAuthorizationDialog.
 * @private
 * @returns {{
 *     _displayName: string
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { participantId } = ownProps;
    const participant = getParticipantById(
            state['features/base/participants'], participantId);

    return {
        _displayName: participant.name
    };
}

export default translate(
    connect(_mapStateToProps)(RemoteControlAuthorizationDialog));
