
import './ChatSetting.css';
function ChatSettingModal({ setShowSettings }) {
    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="modal-header">
                    {/* <h5 className="modal-title">Chat Settings</h5> */}
                    <button className="close text-left" onClick={() => setShowSettings(false)}>&times;</button>
                </div>
                <div className="modal-body">

                    {/* Who can message you */}
                    <div className="form-group mb-4">
                        <label className="section-title">Allow messages from:</label>
                        <p>You will always be able to receive messages from people you follow</p>
                        <div className="option-group ">
                            <div className='label'>
                                <div>
                                    <span>Everyone</span>
                                </div>
                                <div>
                                    <input type="radio" name="message_privacy" value="everyone" className="purple-radio" />
                                </div>

                            </div>
                            <div className='label'>
                                <div>
                                    <span>No one</span>
                                </div>
                                <div>
                                    <input type="radio" name="message_privacy" value="noone" className="purple-radio" />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Enable video and audio calling */}
                    <div className="option-group  ">
                        <div className='label'>
                            <div>
                                <span>No one</span>
                                <p>When enabled, you can select who you’re comfortable using it with</p>
                            </div>
                            <div>
                                <label className="switch m-0">
                                    <input type="checkbox" className="purple-switch" />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                        </div>
                        <div className='label'>
                            <div>
                                <span>People you follow</span>
                            </div>
                            <div>
                                <input type="radio" name="call_privacy" value="following" className="purple-radio" />
                            </div>

                        </div>
                        <div className='label'>
                            <div>
                                <span>Your followers</span>
                            </div>
                            <div>
                                <input type="radio" name="call_privacy" value="followers" className="purple-radio" />
                            </div>

                        </div>
                        <div className='label'>
                            <div>
                                <span>Everyone</span>
                            </div>
                            <div>
                                <input type="radio" name="call_privacy" value="everyone" className="purple-radio" />
                            </div>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    )

}

export default ChatSettingModal;
