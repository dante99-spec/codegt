import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions"

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import {CRUD_ACTIONS, LANGUAGES} from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';



const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {

   constructor(props) {
       super(props);
       this.state = {
          contentMarkdown: '',
          contentHTML: '',
          selectedOption: '',
          description: '',
          listDoctors: [],
          hasOldData: false,
       }
   }
    
   componentDidMount() {
      this.props.fetchAllDoctors()
   }
   
   buildDataInputSelect = (inputData) => {
    let result = [];
    let {language} = this.props;
    if(inputData && inputData.length> 0){
        inputData.map((item, index) => {
         let object = {};
         let labelVi = `${item.lastName} ${item.firstName}`;
         let labelEn = `${item.firstName} ${item.lastName}`

         object.label = language === LANGUAGES.VI ? labelVi : labelEn;
         object.value = item.id;
         result.push(object)
        })
      
    }

    return result;
}

   componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.allDoctors !== this.props.allDoctors) {
          let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
          this.setState({ 
              listDoctors: dataSelect
            // listDoctors: this.props.allDoctors
            
          })
          
      }
      if(prevProps.language !== this.props.language){
        let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        this.setState({ 
            listDoctors: dataSelect
        })
      }
   }

  
   handleDeleteUser = (user) => {
       this.props.deleteAUserRedux(user.id);
   }
   handleEditUser = (user) => {
       this.props.handEditUserFromParentKey(user)
   }
   handleEditorChange = ({ html, text }) => {
       this.setState({
           contentMarkdown: text,
           contentHTML: html,
       })
    
  }
  handleSaveContentMarkdown = () => {
      let {hasOldData} = this.state
     this.props. saveDetailDoctor({
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        description: this.state.description,
        doctorId: this.state.selectedOption.value,
        action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
     })
  }
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption })

    let res = await getDetailInforDoctor (selectedOption.value)
    if(res && res.errCode === 0 && res.data && res.data.markdown){
        let markdown = res.data.markdown;
        this.setState({ 
            contentHTML: markdown.contentHTML,
            contentMarkdown: markdown.contentMarkdown,
            description: markdown.description,
            hasOldData: true
        })
    }else{
        this.setState({ 
            contentHTML: '' ,
            contentMarkdown: '',
            description: '',
            hasOldData: false
        })
    }
    
  };
  handleOnchangeDesc = (event) => {
      this.setState({
          description: event.target.value
      })
  }
    render() {
        let {hasOldData} = this.state;
        return (
            <div className="manage-doctor-container">
               <div className="manage-doctor-title">
                   T???o th??m th??ng tin b??c s?? 
                   </div>
                   <div className="more-infor">
                   <div className="content-left form-group">
                       
                       <label>Ch???n b??c s?? </label>
                       <Select
                        value={this.state.selectedOption}
                        onChange={this.handleChangeSelect}
                        options={this.state.listDoctors}
                        />
                   </div> 
                   <div className="content-right">
                   <label>Th??ng tin gi???i thi???u </label>
                   <textarea className="form-control" rows="4"
                    onChange={(event) => this.handleOnchangeDesc(event)}
                    value={this.state.description}
                    >
                           bbbbbbb
                       </textarea>
                   </div>
                   </div>
               <div className="manage-doctor-editor">
               <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.contentMarkdown}/>
               </div>
                   <button onClick={() => this.handleSaveContentMarkdown()}className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}>
                       {hasOldData === true ?
                       <span>L??u th??ng tin</span> : <span>T???o th??ng tin</span>
                    }
                      
                       </button>
            </div>
            );
            }
            }

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language
       
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () =>  dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
