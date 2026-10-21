import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ledgerly.settings')

import django

django.setup()

from core.utils import send_otp_email


send_otp_email('eninlavictor30@gmail.com', '123456' ,'victor')
