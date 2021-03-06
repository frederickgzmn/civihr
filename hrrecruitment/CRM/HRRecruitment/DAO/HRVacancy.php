<?php
/*
+--------------------------------------------------------------------+
| CiviCRM version 4.7                                                |
+--------------------------------------------------------------------+
| Copyright CiviCRM LLC (c) 2004-2016                                |
+--------------------------------------------------------------------+
| This file is a part of CiviCRM.                                    |
|                                                                    |
| CiviCRM is free software; you can copy, modify, and distribute it  |
| under the terms of the GNU Affero General Public License           |
| Version 3, 19 November 2007 and the CiviCRM Licensing Exception.   |
|                                                                    |
| CiviCRM is distributed in the hope that it will be useful, but     |
| WITHOUT ANY WARRANTY; without even the implied warranty of         |
| MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.               |
| See the GNU Affero General Public License for more details.        |
|                                                                    |
| You should have received a copy of the GNU Affero General Public   |
| License and the CiviCRM Licensing Exception along                  |
| with this program; if not, contact CiviCRM LLC                     |
| at info[AT]civicrm[DOT]org. If you have questions about the        |
| GNU Affero General Public License or the licensing of CiviCRM,     |
| see the CiviCRM license FAQ at http://civicrm.org/licensing        |
+--------------------------------------------------------------------+
*/
/**
 * @package CRM
 * @copyright CiviCRM LLC (c) 2004-2016
 *
 * Generated from xml/schema/CRM/HRRecruitment/HRVacancy.xml
 * DO NOT EDIT.  Generated by CRM_Core_CodeGen
 */
require_once 'CRM/Core/DAO.php';
require_once 'CRM/Utils/Type.php';
class CRM_HRRecruitment_DAO_HRVacancy extends CRM_Core_DAO
{
  /**
   * static instance to hold the table name
   *
   * @var string
   */
  static $_tableName = 'civicrm_hrvacancy';
  /**
   * static instance to hold the field values
   *
   * @var array
   */
  static $_fields = null;
  /**
   * static instance to hold the keys used in $_fields for each field.
   *
   * @var array
   */
  static $_fieldKeys = null;
  /**
   * static instance to hold the FK relationships
   *
   * @var string
   */
  static $_links = null;
  /**
   * static instance to hold the values that can
   * be imported
   *
   * @var array
   */
  static $_import = null;
  /**
   * static instance to hold the values that can
   * be exported
   *
   * @var array
   */
  static $_export = null;
  /**
   * static value to see if we should log any modifications to
   * this table in the civicrm_log table
   *
   * @var boolean
   */
  static $_log = true;
  /**
   * Unique Recruitment Vacancy ID
   *
   * @var int unsigned
   */
  public $id;
  /**
   * Salary offered in vacancy
   *
   * @var string
   */
  public $salary;
  /**
   * Job Position offered in vacancy
   *
   * @var string
   */
  public $position;
  /**
   * Description of vacancy
   *
   * @var longtext
   */
  public $description;
  /**
   *
   * @var longtext
   */
  public $benefits;
  /**
   * Requirements of vacancy
   *
   * @var longtext
   */
  public $requirements;
  /**
   * Location of vacancy
   *
   * @var string
   */
  public $location;
  /**
   * Whether the Vacancy has template
   *
   * @var boolean
   */
  public $is_template;
  /**
   * Status of Vacancy
   *
   * @var int unsigned
   */
  public $status_id;
  /**
   * Vacancy Start Date
   *
   * @var datetime
   */
  public $start_date;
  /**
   * Vacancy End Date
   *
   * @var datetime
   */
  public $end_date;
  /**
   * Vacancy Created Date
   *
   * @var datetime
   */
  public $created_date;
  /**
   * FK to civicrm_contact, who created this vacancy
   *
   * @var int unsigned
   */
  public $created_id;
  /**
   * class constructor
   *
   * @return civicrm_hrvacancy
   */
  function __construct()
  {
    $this->__table = 'civicrm_hrvacancy';
    parent::__construct();
  }
  /**
   * Returns foreign keys and entity references
   *
   * @return array
   *   [CRM_Core_Reference_Interface]
   */
  static function getReferenceColumns()
  {
    if (!self::$_links) {
      self::$_links = static ::createReferenceColumns(__CLASS__);
      self::$_links[] = new CRM_Core_Reference_Basic(self::getTableName() , 'created_id', 'civicrm_contact', 'id');
    }
    return self::$_links;
  }
  /**
   * Returns all the column names of this table
   *
   * @return array
   */
  static function &fields()
  {
    if (!(self::$_fields)) {
      self::$_fields = array(
        'id' => array(
          'name' => 'id',
          'type' => CRM_Utils_Type::T_INT,
          'description' => 'Unique Recruitment Vacancy ID',
          'required' => true,
        ) ,
        'salary' => array(
          'name' => 'salary',
          'type' => CRM_Utils_Type::T_STRING,
          'title' => ts('Salary') ,
          'description' => 'Salary offered in vacancy',
          'maxlength' => 127,
          'size' => CRM_Utils_Type::HUGE,
        ) ,
        'position' => array(
          'name' => 'position',
          'type' => CRM_Utils_Type::T_STRING,
          'title' => ts('Position') ,
          'description' => 'Job Position offered in vacancy',
          'maxlength' => 127,
          'size' => CRM_Utils_Type::HUGE,
        ) ,
        'description' => array(
          'name' => 'description',
          'type' => CRM_Utils_Type::T_LONGTEXT,
          'title' => ts('Description') ,
          'description' => 'Description of vacancy',
        ) ,
        'benefits' => array(
          'name' => 'benefits',
          'type' => CRM_Utils_Type::T_LONGTEXT,
          'title' => ts('Benefits') ,
        ) ,
        'requirements' => array(
          'name' => 'requirements',
          'type' => CRM_Utils_Type::T_LONGTEXT,
          'title' => ts('Requirements') ,
          'description' => 'Requirements of vacancy',
        ) ,
        'location' => array(
          'name' => 'location',
          'type' => CRM_Utils_Type::T_STRING,
          'title' => ts('Location') ,
          'description' => 'Location of vacancy',
          'maxlength' => 254,
          'size' => CRM_Utils_Type::HUGE,
          'pseudoconstant' => array(
            'optionGroupName' => 'hrjc_location',
            'optionEditPath' => 'civicrm/admin/options/hrjc_location',
          )
        ) ,
        'is_template' => array(
          'name' => 'is_template',
          'type' => CRM_Utils_Type::T_BOOLEAN,
          'description' => 'Whether the Vacancy has template',
        ) ,
        'status_id' => array(
          'name' => 'status_id',
          'type' => CRM_Utils_Type::T_INT,
          'title' => ts('Status') ,
          'description' => 'Status of Vacancy',
          'pseudoconstant' => array(
            'optionGroupName' => 'vacancy_status',
            'optionEditPath' => 'civicrm/admin/options/vacancy_status',
          )
        ) ,
        'start_date' => array(
          'name' => 'start_date',
          'type' => CRM_Utils_Type::T_DATE + CRM_Utils_Type::T_TIME,
          'title' => ts('Start Date') ,
          'description' => 'Vacancy Start Date',
        ) ,
        'end_date' => array(
          'name' => 'end_date',
          'type' => CRM_Utils_Type::T_DATE + CRM_Utils_Type::T_TIME,
          'title' => ts('End Date') ,
          'description' => 'Vacancy End Date',
        ) ,
        'created_date' => array(
          'name' => 'created_date',
          'type' => CRM_Utils_Type::T_DATE + CRM_Utils_Type::T_TIME,
          'title' => ts('Created Date') ,
          'description' => 'Vacancy Created Date',
        ) ,
        'created_id' => array(
          'name' => 'created_id',
          'type' => CRM_Utils_Type::T_INT,
          'description' => 'FK to civicrm_contact, who created this vacancy',
          'FKClassName' => 'CRM_Contact_DAO_Contact',
        ) ,
      );
    }
    return self::$_fields;
  }
  /**
   * Returns an array containing, for each field, the arary key used for that
   * field in self::$_fields.
   *
   * @return array
   */
  static function &fieldKeys()
  {
    if (!(self::$_fieldKeys)) {
      self::$_fieldKeys = array(
        'id' => 'id',
        'salary' => 'salary',
        'position' => 'position',
        'description' => 'description',
        'benefits' => 'benefits',
        'requirements' => 'requirements',
        'location' => 'location',
        'is_template' => 'is_template',
        'status_id' => 'status_id',
        'start_date' => 'start_date',
        'end_date' => 'end_date',
        'created_date' => 'created_date',
        'created_id' => 'created_id',
      );
    }
    return self::$_fieldKeys;
  }
  /**
   * Returns the names of this table
   *
   * @return string
   */
  static function getTableName()
  {
    return self::$_tableName;
  }
  /**
   * Returns if this table needs to be logged
   *
   * @return boolean
   */
  function getLog()
  {
    return self::$_log;
  }
  /**
   * Returns the list of fields that can be imported
   *
   * @param bool $prefix
   *
   * @return array
   */
  static function &import($prefix = false)
  {
    if (!(self::$_import)) {
      self::$_import = array();
      $fields = self::fields();
      foreach($fields as $name => $field) {
        if (CRM_Utils_Array::value('import', $field)) {
          if ($prefix) {
            self::$_import['hrvacancy'] = & $fields[$name];
          } else {
            self::$_import[$name] = & $fields[$name];
          }
        }
      }
    }
    return self::$_import;
  }
  /**
   * Returns the list of fields that can be exported
   *
   * @param bool $prefix
   *
   * @return array
   */
  static function &export($prefix = false)
  {
    if (!(self::$_export)) {
      self::$_export = array();
      $fields = self::fields();
      foreach($fields as $name => $field) {
        if (CRM_Utils_Array::value('export', $field)) {
          if ($prefix) {
            self::$_export['hrvacancy'] = & $fields[$name];
          } else {
            self::$_export[$name] = & $fields[$name];
          }
        }
      }
    }
    return self::$_export;
  }
}
