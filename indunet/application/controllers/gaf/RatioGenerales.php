<?php 
    
    defined('BASEPATH') OR exit('No direct script access allowed');
    
    class RatioGenerales extends CI_Controller {

        
        public function __construct()
        {
            parent::__construct();
            $this->load->model(array('gaf/MratioGenerales'));
            
        }
        
    
        public function index()
        {
            
        }
        public function getDatosIniciales(){

            $ratios=$this->MratioGenerales->getRatiosBycampo();
            echo json_encode($ratios);
        }
        public function guardarCambios(){
            $dataratio=$this->input->post('array_editados');                 
            //print_r($dataratio); 
            if(count($dataratio)>0){
                $data_preparada=array();
                foreach($dataratio as $jm=>$data){                 
                                        
                        $ratio=array('idratio'=>$data['Codigo'],
                                        'vNombreRatio'=>$data['Descripcion'],
                                        'nRatioOperarioProduccion'=>$data['OperProd'],
                                        'nRatioOperarioAcondicionado'=>$data['OperAcond'],
                                        'nRatioProfesionalProduccion'=>$data['AdminProd'],
                                        'nRatioProfesionalAcondicionado'=>$data['AdminAcond'],
                                        'nRatioLabPP'=>$data['LabPP'],
                                        'nRatioLabPT'=>$data['LabPT'],
                                        'nRatioLabMP'=>$data['LabMP'],
                                        'nRatioInvDes'=>$data['Invdes']
                                        ); 
                        array_push($data_preparada,$ratio); 
                }
                //print_r($data_preparada); exit;
                foreach($data_preparada as $data){
                    $this->MratioGenerales->actualizarRatios($data);
                }

                echo 1;
            }else{
                echo 2;
            }
        }
    
    
    }
    
    /* End of file RatioGenerales.php */
    
?>