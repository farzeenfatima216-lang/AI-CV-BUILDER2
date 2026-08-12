import sys
sys.path.append(r'c:\Users\pc\Documents\AI_Professional_cv builder')

from backend.app.main import signup, SignupRequest
from backend.app.database import SessionLocal

# cleanup test email if present
from backend.app import models

session = SessionLocal()
try:
    session.query(models.User).filter(models.User.email == 'diag@example.com').delete()
    session.commit()
except Exception:
    session.rollback()
finally:
    session.close()

session = SessionLocal()
try:
    payload = SignupRequest(name='Diag User', email='diag@example.com', password='TestPass123!')
    result = signup(payload, db=session)
    print('RESULT', result)
except Exception as e:
    print('EXCEPTION', type(e), e)
    import traceback
    traceback.print_exc()
finally:
    session.close()
