<?php 
    
    defined('BASEPATH') OR exit('No direct script access allowed');
    
    class Depreciacion extends CI_Controller {

        
        public function __construct()
        {
            parent::__construct();
            $this->load->model(array('gaf/Mdepreciacion'));
            
        }
        
    
        public function index()
        {
            
        }
        public function getDatosIniciales(){

            $datos=$this->Mdepreciacion->getDatosBycampo();

            $datos['cabeceras'][7]='Total';
            $datos['columnas'][7]=["data"=>'Total',"type"=>'numeric',"width"=>'',"readOnly"=>1];
            //print_r($datos['rows']); exit;
            foreach($datos['rows'] as $jm=>$row){
                $datos['rows'][$jm]['Total']=number_format((float)($row['Produccion']+$row['Administracion']+$row['Ventas']+$row['Control']+$row['Mantenimiento']), 4, '.', '');
            }

            $depre=$this->Mdepreciacion->getDatosDepre();
            $datos['depreciacion']=$depre;
            //print_r($datos); exit;
            echo json_encode($datos,JSON_NUMERIC_CHECK);
        }
        public function guardarCambios(){
            $datadepre=$this->input->post('array_editados');    
            //print_r($data); exit;
            $data_depreciacion=array(
                'vCodigoDepreciacion'=>1414,
                'nDepProduccion'=>$this->input->post('depreciacion_produccion'),
                'nDepControl'=>$this->input->post('depreciacion_control')
            );
            
            $this->Mdepreciacion->actualizarDepreciacion($data_depreciacion);

            if(count($datadepre)>0){
                $data_preparada=array();
                foreach($datadepre as $jm=>$data){                
                                        
                        $dato=array(  
                                        'vCodigoDepreciacion'=>$data['Codigo'],
                                        'vNombreDepreciacion'=>$data['Descripcion'],
                                        'nDepProduccion'=>$data['Produccion'],
                                        'nDepAdministrativo'=>$data['Administracion'],
                                        'nDepVentas'=>$data['Ventas'],
                                        'nDepControl'=>$data['Control'],
                                        'nDepMantenimiento'=>$data['Mantenimiento'],
                            
                                        ); 
                        array_push($data_preparada,$dato); 
                }
                //unset($data_preparada[6]);
                //print_r($data_preparada); exit;
                //echo json_encode($data_preparada);
                foreach($data_preparada as $data){
                    $this->Mdepreciacion->actualizarDepreciacion($data);
                }
            }

            echo 1;
        }
    
    }
    
    
?>