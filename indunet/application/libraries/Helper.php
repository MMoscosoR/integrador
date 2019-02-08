<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Helper{


  function index()
  {

  }
  function prepararDatosGrilla($colums,$rows){
    $return['cabeceras']=array();
            foreach ($colums as $key) {
                $campo['title']=$key;
                array_push($return['cabeceras'],$campo);
            }
      $return['nuevadata']=array();
            foreach ($rows as $key) {
                $obj=array();
                foreach ($colums as $key2) {
                        array_push($obj,$key->$key2);
                  }
              array_push($return['nuevadata'],$obj);
            }
    return $return;
    }

  }
