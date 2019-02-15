<?php 
    
    defined('BASEPATH') OR exit('No direct script access allowed');
    
    class MratioGenerales extends CI_Model {
        const tbl_ratiosGenerales="GAF_ratiosGenerales";

        public function getRatiosBycampo($campo=null,$valor=null){

            $this->db->select('idratio as Codigo,
                                vNombreRatio as Descripcion,
                                nRatioOperarioProduccion as OperProd,
                                nRatioOperarioAcondicionado as OperAcond,
                                nRatioProfesionalProduccion as AdminProd,
                                nRatioProfesionalAcondicionado as AdminAcond,
                                nRatioLabPP as LabPP,
                                nRatioLabPT as LabPT,
                                nRatioLabMP as LabMP,
                                nRatioInvDes as Invdes
                                ')->from($this::tbl_ratiosGenerales)->where('iEstado',0);            
            if(!is_null($campo) or !is_null($valor)){
                $this->db->where($campo,$valor);
            }
            $query=$this->db->get();
            $data['cabeceras']  =$query->list_fields();
            $columnas = array();
            foreach($query->field_data() as $key){
                $columna['data']=$key->name;                
                $columna['type']=(in_array($key->type,array(4,3,2)))?'numeric':'text';
                $columna['widh']=$key->max_length;
                $columna['readOnly']=true;

                array_push($columnas,$columna);
            }   
            $data['columnas']   =$columnas;            
            $data['rows']=array(); 
                      
            foreach ($query->result() as $key) {
                $z['Codigo']=(int)$key->Codigo;
                $z['Descripcion']=(string) $key->Descripcion;
                $z['OperProd']=(float) $key->OperProd;
                $z['OperAcond']=(float) $key->OperAcond;  
                $z['AdminProd']=(float) $key->AdminProd;  
                $z['AdminAcond']=(float) $key->AdminAcond;
                $z['LabPP']=(float) $key->LabPP; 
                $z['LabPT']=(float) $key->LabPT; 
                $z['LabMP']=(float) $key->LabMP;
                $z['Invdes']=(float) $key->Invdes;  
                array_push($data['rows'],$z); 
            }  
            //print_r($data); exit; 
            return $data;
        }

        /*public function actualizarRatios($ratios){
            try {
                $this->db->update_batch($this::tbl_ratiosGenerales, $ratios,'idratio');
                return $this->db->affected_rows();
            } catch (Exception $e) {
                return 0;
            }            
        }*/

        public function actualizarRatios($ratios){
            $this->db->where('idratio',$ratios['idratio']);
            unset($ratios['idratio']);
            $this->db->update('GAF_ratiosGenerales',$ratios);
            return $this->db->affected_rows();            
        }
    
    }
    
    /* End of file MratioGenerales.php */
    
?>