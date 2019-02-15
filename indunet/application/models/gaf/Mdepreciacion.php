<?php 
    
    defined('BASEPATH') OR exit('No direct script access allowed');
    
    class Mdepreciacion extends CI_Model {
        const tbl_depreciacion="GAF_depreciacion";

        public function getDatosBycampo($campo=null,$valor=null){

            $this->db->select(' 
                                vCodigoDepreciacion as Codigo,
                                vNombreDepreciacion as Descripcion,
                                nDepProduccion as Produccion,
                                nDepAdministrativo as Administracion,
                                nDepVentas as Ventas,
                                nDepControl as Control,
                                nDepMantenimiento as Mantenimiento,
                                ')->from($this::tbl_depreciacion)->where('iEstado',0);            
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
                $z['Produccion']=(float) $key->Produccion;
                $z['Administracion']=(float) $key->Administracion;  
                $z['Ventas']=(float) $key->Ventas;  
                $z['Control']=(float) $key->Control;
                $z['Mantenimiento']=(float) $key->Mantenimiento; 
   
                array_push($data['rows'],$z); 
            }  
            
            return $data;
        }

        public function getDatosDepre(){
            $this->db->select('nDepProduccion as prod,nDepControl as cont');
            $this->db->where('vCodigoDepreciacion',1414);
            $query=$this->db->get('GAF_depreciacion');
            return $query->row_array();
        }

        public function actualizarDepreciacion($data=array()){
            $this->db->where('vCodigoDepreciacion',$data['vCodigoDepreciacion']);
            $this->db->update('GAF_depreciacion',$data);
            return $this->db->affected_rows();            
        }
    
    }
    
    /* End of file MratioGenerales.php */
    
?>