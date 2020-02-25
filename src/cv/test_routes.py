import mock
import pytest
from flask import Flask, request
from pytest_mock import mocker
import app

def test_get_stream_route(mocker):
    with app.app.test_client() as c:
        c.get('/display_stream?link=abc')
        assert request.args['link'] == 'abc'
