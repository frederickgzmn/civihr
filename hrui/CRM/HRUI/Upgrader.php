<?php
/*
+--------------------------------------------------------------------+
| CiviHR version 1.4                                                 |
+--------------------------------------------------------------------+
| Copyright CiviCRM LLC (c) 2004-2014                                |
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
 * Collection of upgrade steps
 */
class CRM_HRUI_Upgrader extends CRM_HRUI_Upgrader_Base {

  // By convention, functions that look like "function upgrade_NNNN()" are
  // upgrade tasks. They are executed in order (like Drupal's hook_update_N).

  /**
   * Example: Run an external SQL script when the module is installed
   *
  public function install() {
    $this->executeSqlFile('sql/myinstall.sql');
  }

  /**
   * Example: Run an external SQL script when the module is uninstalled
   *
  public function uninstall() {
   $this->executeSqlFile('sql/myuninstall.sql');
  }

  /**
   * Example: Run a simple query when a module is enabled
   *
  public function enable() {
    CRM_Core_DAO::executeQuery('UPDATE foo SET is_active = 1 WHERE bar = "whiz"');
  }

  /**
   * Example: Run a simple query when a module is disabled
   *
  public function disable() {
    CRM_Core_DAO::executeQuery('UPDATE foo SET is_active = 0 WHERE bar = "whiz"');
  }
   */

  /**
   * Change the URL of the blog feed on the dashboard
   *
   * @return TRUE on success
   * @throws Exception
   */
  public function upgrade_4400() {
    civicrm_api3('setting', 'create', array(
      'version' => 3,
      'blogUrl' => 'https://civicrm.org/taxonomy/term/198/feed',
    ));
    return TRUE;
  }

  /**
   * Example: Run a couple simple queries
   *
   * @return TRUE on success
   * @throws Exception
   *
  public function upgrade_4200() {
    $this->ctx->log->info('Applying update 4200');
    CRM_Core_DAO::executeQuery('UPDATE foo SET bar = "whiz"');
    CRM_Core_DAO::executeQuery('DELETE FROM bang WHERE willy = wonka(2)');
    return TRUE;
  } // */


  /**
   * Example: Run an external SQL script
   *
   * @return TRUE on success
   * @throws Exception
  public function upgrade_4201() {
    $this->ctx->log->info('Applying update 4201');
    // this path is relative to the extension base dir
    $this->executeSqlFile('sql/upgrade_4201.sql');
    return TRUE;
  } // */


  /**
   * Example: Run a slow upgrade process by breaking it up into smaller chunk
   *
   * @return TRUE on success
   * @throws Exception
  public function upgrade_4202() {
    $this->ctx->log->info('Planning update 4202'); // PEAR Log interface

    $this->addTask(ts('Process first step'), 'processPart1', $arg1, $arg2);
    $this->addTask(ts('Process second step'), 'processPart2', $arg3, $arg4);
    $this->addTask(ts('Process second step'), 'processPart3', $arg5);
    return TRUE;
  }
  public function processPart1($arg1, $arg2) { sleep(10); return TRUE; }
  public function processPart2($arg3, $arg4) { sleep(10); return TRUE; }
  public function processPart3($arg5) { sleep(10); return TRUE; }
  // */


  /**
   * Example: Run an upgrade with a query that touches many (potentially
   * millions) of records by breaking it up into smaller chunks.
   *
   * @return TRUE on success
   * @throws Exception
  public function upgrade_4203() {
    $this->ctx->log->info('Planning update 4203'); // PEAR Log interface

    $minId = CRM_Core_DAO::singleValueQuery('SELECT coalesce(min(id),0) FROM civicrm_contribution');
    $maxId = CRM_Core_DAO::singleValueQuery('SELECT coalesce(max(id),0) FROM civicrm_contribution');
    for ($startId = $minId; $startId <= $maxId; $startId += self::BATCH_SIZE) {
      $endId = $startId + self::BATCH_SIZE - 1;
      $title = ts('Upgrade Batch (%1 => %2)', array(
        1 => $startId,
        2 => $endId,
      ));
      $sql = '
        UPDATE civicrm_contribution SET foobar = whiz(wonky()+wanker)
        WHERE id BETWEEN %1 and %2
      ';
      $params = array(
        1 => array($startId, 'Integer'),
        2 => array($endId, 'Integer'),
      );
      $this->addTask($title, 'executeSql', $sql, $params);
    }
    return TRUE;
  } // */

  public function upgrade_4500() {
    $this->ctx->log->info('Planning update 1400');
    //disable individual contact sub types
    $individualTypeId = civicrm_api3('ContactType', 'getsingle', array('return' => "id",'name' => "Individual"));
    $subContactId = civicrm_api3('ContactType', 'get', array('parent_id' => $individualTypeId['id']));
    foreach ($subContactId['values'] as $key) {
      $paramsSubType = array(
        'name' => $key['name'],
        'id' => $key['id'],
        'is_active' => FALSE,
      );
      civicrm_api3('ContactType', 'create', $paramsSubType);
    }

    $orgTypeId = civicrm_api3('ContactType', 'getsingle', array('return' => "id",'name' => "Organization"));
    $subOrgId = civicrm_api3('ContactType', 'get', array('parent_id' => $orgTypeId['id']));
    foreach ($subOrgId['values'] as $key) {
      if ($key['name'] == 'Team' || $key['name'] == 'Sponsor') {
	$paramsSubType = array(
          'name' => $key['name'],
          'id' => $key['id'],
          'is_active' => FALSE,
        );
	civicrm_api3('ContactType', 'create', $paramsSubType);
      }
    }
    CRM_Core_BAO_Navigation::resetNavigation();

    //hide/disable constitution information block
    $query = "UPDATE civicrm_custom_field JOIN civicrm_custom_group ON civicrm_custom_group.id = civicrm_custom_field.custom_group_id SET civicrm_custom_field.is_active = 0 WHERE civicrm_custom_group.name = 'constituent_information'";
    CRM_Core_DAO::executeQuery($query);
    CRM_Core_DAO::executeQuery("UPDATE civicrm_custom_group SET is_active = 0 WHERE name = 'constituent_information'");

    //disable optionGroup and optionValue
    $query = "UPDATE civicrm_option_value JOIN civicrm_option_group ON civicrm_option_group.id = civicrm_option_value.option_group_id SET civicrm_option_value.is_active = 0 WHERE civicrm_option_group.name IN ('custom_most_important_issue', 'custom_marital_status')";
    CRM_Core_DAO::executeQuery($query);
    CRM_Core_DAO::executeQuery("UPDATE civicrm_option_group SET is_active = 0 WHERE name IN ('custom_most_important_issue', 'custom_marital_status')");
    CRM_Core_DAO::executeQuery("UPDATE civicrm_dashboard SET label = 'CiviHR News' WHERE name = 'blog' ");
    CRM_Core_DAO::executeQuery("UPDATE civicrm_dashboard SET label = 'Assignments Dashlet' WHERE name = 'casedashboard' ");

    //delete default tag of civicrm
    CRM_Core_DAO::executeQuery("DELETE FROM civicrm_tag WHERE name IN ('Non-profit', 'Company', 'Government Entity', 'Major Donor', 'Volunteer')");
    return TRUE;
  }

  public function upgrade_4501() {
    $this->ctx->log->info('Planning update 1401');
    CRM_Core_DAO::executeQuery("UPDATE civicrm_relationship_type SET is_active = 1 WHERE name_a_b IN ( 'Case Coordinator is' )");
    return TRUE;
  }
}
