<?php

use Civi\Test\HeadlessInterface;
use Civi\Test\TransactionalInterface;

/**
 * Class api_v3_HRJobContractTest
 *
 * @group headless
 */
class api_v3_HRJobContractTest extends PHPUnit_Framework_TestCase implements
  HeadlessInterface,
  TransactionalInterface {

  use HRJobContractTestTrait;

  public function setUpHeadless() {
    return \Civi\Test::headless()->installMe(__DIR__)->apply();
  }

  /**
   * @expectedException CiviCRM_API3_Exception
   * @expectedExceptionMessage The start date parameter can only be used with the = operator
   *
   * @dataProvider invalidGetActiveContractsDateOperator
   */
  public function testOnGetActiveContractsTheStartDateOnlyAcceptsTheEqualOperator($operator) {
    civicrm_api3('HRJobContract', 'getactivecontracts', ['start_date' => [$operator => '2016-01-01']]);
  }

  /**
   * @expectedException CiviCRM_API3_Exception
   * @expectedExceptionMessage The end date parameter can only be used with the = operator
   *
   * @dataProvider invalidGetActiveContractsDateOperator
   */
  public function testOnGetActiveContractsTheEndDateOnlyAcceptsTheEqualOperator($operator) {
    civicrm_api3('HRJobContract', 'getactivecontracts', ['end_date' => [$operator => '2016-01-01']]);
  }

  public function invalidGetActiveContractsDateOperator()
  {
    return [
      ['>'],
      ['>='],
      ['<='],
      ['<'],
      ['<>'],
      ['!='],
      ['BETWEEN'],
      ['NOT BETWEEN'],
      ['LIKE'],
      ['NOT LIKE'],
      ['IN'],
      ['NOT IN'],
      ['IS NULL'],
      ['IS NOT NULL'],
    ];
  }

}
